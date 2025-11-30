"use client";

import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/lib/supabaseClient";
import Navbar from "@/app/components/Navbar";

type Profile = {
  id: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError("Not logged in");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        setError(error.message);
      } else {
        setProfile(
          (data as Profile | null) || {
            id: user.id,
            full_name: user.email ?? "",
            bio: "",
            avatar_url: null,
          }
        );
      }

      setLoading(false);
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setError(null);

    const { error } = await supabase.from("profiles").upsert({
      id: profile.id,
      full_name: profile.full_name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
    } as any);

    if (error) setError(error.message);
    setSaving(false);
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!profile) return;
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      // unique path: userId/timestamp
      const filePath = `${profile.id}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        setError(uploadError.message);
        setUploading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      // update local state
      setProfile({ ...profile, avatar_url: publicUrl });

      // persist to DB
      const { error: updateError } = await supabase.from("profiles").upsert({
        id: profile.id,
        avatar_url: publicUrl,
      } as any);

      if (updateError) setError(updateError.message);
    } catch (err: any) {
      setError(err.message ?? "Error uploading avatar");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="p-6 text-muted-foreground">Loading profile...</main>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <Navbar />
        <main className="p-6 text-red-400">
          {error || "Could not load profile"}
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="max-w-xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold">Your profile</h1>

        {/* Avatar section */}
        <div className="flex items-center gap-4">
          {profile.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt="Avatar"
              className="h-16 w-16 rounded-full object-cover border border-slate-700"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center text-xl font-semibold text-muted-foreground">
              {(profile.full_name || "U").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-foreground">
              Profile picture
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="text-sm text-muted-foreground"
            />
            {uploading && (
              <p className="text-xs text-slate-400">Uploading...</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-foreground mb-1">
              Full name
            </label>
            <input
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              value={profile.full_name ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, full_name: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-foreground mb-1">Bio</label>
            <textarea
              className="w-full rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
              rows={4}
              value={profile.bio ?? ""}
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save profile"}
          </button>
        </div>
      </main>
    </>
  );
}
