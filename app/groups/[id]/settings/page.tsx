"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/app/components/dashboard/Header";
import { Avatar } from "@/app/components/ui/Avatar";

type GroupMember = {
  id: string;
  user_id: string;
  profiles: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    role: string;
  };
};

type Group = {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
};

export default function GroupSettingsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const groupId = params.id as string;

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserAvatar, setCurrentUserAvatar] = useState<string | null>(null);
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addMemberEmail, setAddMemberEmail] = useState("");
  const [addMemberName, setAddMemberName] = useState("");
  const [searching, setSearching] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupDescription, setNewGroupDescription] = useState("");

  useEffect(() => {
    loadGroupData();
  }, []);

  const loadGroupData = async () => {
    setLoading(true);

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    setCurrentUserId(user.id);

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("avatar_url")
      .eq("id", user.id)
      .single();

    if (profile) {
      setCurrentUserAvatar((profile as { avatar_url: string | null }).avatar_url);
    }

    // Load group
    const { data: groupData, error: groupError } = await supabase
      .from("groups")
      .select("*")
      .eq("id", groupId)
      .single();

    if (groupError || !groupData) {
      alert("Group not found");
      router.push("/groups");
      return;
    }

    const typedGroupData = groupData as Group;

    console.log("Group data loaded:", {
      groupOwnerId: typedGroupData.owner_id,
      currentUserId: user.id,
      isMatch: typedGroupData.owner_id === user.id
    });

    setGroup(typedGroupData);
    setIsOwner(typedGroupData.owner_id === user.id);

    // Load members
    await loadMembers();

    setLoading(false);
  };

  const loadMembers = async () => {
    const { data, error } = await supabase
      .from("group_members")
      .select("user_id")
      .eq("group_id", groupId);

    if (error) {
      console.error("Error loading members:", error);
      return;
    }

    if (!data || data.length === 0) {
      setMembers([]);
      return;
    }

    // Fetch profile data separately
    const userIds = data.map((m: any) => m.user_id);
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("id, full_name, avatar_url, role")
      .in("id", userIds);

    if (profileError) {
      console.error("Error loading profiles:", profileError);
      setMembers([]);
      return;
    }

    // Combine the data
    const profileMap = new Map(
      (profiles || []).map((p: any) => [p.id, p])
    );

    const membersWithProfiles = data.map((member: any) => ({
      id: `${groupId}-${member.user_id}`, // Generate a unique ID
      user_id: member.user_id,
      profiles: profileMap.get(member.user_id) || {
        id: member.user_id,
        full_name: "Unknown User",
        avatar_url: null,
        role: "user"
      }
    }));

    setMembers(membersWithProfiles as GroupMember[]);
  };

  const handleUpdateGroupName = async () => {
    if (!newGroupName.trim()) {
      alert("Group name cannot be empty");
      return;
    }

    if (!isOwner) {
      alert("Only the group owner can edit the group name");
      return;
    }

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: newGroupName.trim(),
          userId: currentUserId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update group name');
      }

      // Update local state with the returned data
      if (result.data) {
        setGroup((prev) => prev ? { ...prev, name: result.data.name } : null);
      }
      setEditingName(false);
      alert("Group name updated successfully!");
    } catch (error: any) {
      console.error("Error updating group name:", error);
      alert(`Failed to update group name: ${error.message}`);
    }
  };

  const handleUpdateGroupDescription = async () => {
    if (!isOwner) {
      alert("Only the group owner can edit the group description");
      return;
    }

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: newGroupDescription.trim() || null,
          userId: currentUserId,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update group description');
      }

      // Update local state with the returned data
      if (result.data) {
        setGroup((prev) => prev ? { ...prev, description: result.data.description } : null);
      }
      setEditingDescription(false);
      alert("Group description updated successfully!");
    } catch (error: any) {
      console.error("Error updating group description:", error);
      alert(`Failed to update group description: ${error.message}`);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();

    const searchTerm = addMemberName.trim() || addMemberEmail.trim();

    if (!searchTerm) {
      alert("Please enter a name to search");
      return;
    }

    setSearching(true);

    try {
      // Search by name (works for both full name input or email username)
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .ilike("full_name", `%${searchTerm}%`)
        .limit(5); // Get up to 5 matches

      if (userError) {
        console.error("Error searching users:", userError);
        alert("Error searching for users");
        setSearching(false);
        return;
      }

      if (!userData || userData.length === 0) {
        alert("User not found. Please enter the exact name as it appears in their profile.");
        setSearching(false);
        return;
      }

      type UserSearchResult = { id: string; full_name: string | null };
      const typedUserData = userData as UserSearchResult[];

      // If multiple matches, use the first one
      let selectedUser = typedUserData[0];

      // If we have multiple matches, show them to the user
      if (typedUserData.length > 1) {
        const names = typedUserData.map((u, i) => `${i + 1}. ${u.full_name}`).join("\n");
        const choice = prompt(
          `Multiple users found:\n${names}\n\nEnter the number of the user you want to add (1-${typedUserData.length}):`
        );

        const choiceNum = parseInt(choice || "1");
        if (choiceNum >= 1 && choiceNum <= typedUserData.length) {
          selectedUser = typedUserData[choiceNum - 1];
        } else {
          alert("Invalid selection. Adding the first user.");
        }
      }

      // Check if already a member
      const { data: existingMember } = await supabase
        .from("group_members")
        .select("user_id")
        .eq("group_id", groupId)
        .eq("user_id", selectedUser.id)
        .maybeSingle();

      if (existingMember) {
        alert("This user is already a member of this group");
        setSearching(false);
        return;
      }

      // Add member
      const { error: addError } = await supabase
        .from("group_members")
        .insert({
          group_id: groupId,
          user_id: selectedUser.id,
        } as any);

      if (addError) {
        console.error("Error adding member:", addError);
        alert("Failed to add member to group");
        setSearching(false);
        return;
      }

      alert(`${selectedUser.full_name} has been added to the group!`);
      setAddMemberEmail("");
      setAddMemberName("");
      setSearching(false);
      loadMembers();
    } catch (error) {
      console.error("Error in handleAddMember:", error);
      alert("An error occurred while adding the member");
      setSearching(false);
    }
  };

  const handleRemoveMember = async (userId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from the group?`)) return;

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error removing member:", error);
      alert("Failed to remove member");
      return;
    }

    alert(`${memberName} has been removed from the group`);
    loadMembers();
  };

  const handleLeaveGroup = async () => {
    if (!currentUserId) return;

    if (!confirm("Are you sure you want to leave this group?")) return;

    const { error } = await supabase
      .from("group_members")
      .delete()
      .eq("group_id", groupId)
      .eq("user_id", currentUserId);

    if (error) {
      console.error("Error leaving group:", error);
      alert("Failed to leave group");
      return;
    }

    router.push("/groups");
  };

  if (loading) {
    return (
      <>
        <Header avatarUrl={currentUserAvatar ?? undefined} />
        <div className="max-w-[800px] mx-auto px-4 py-6">
          <p className="text-sm text-slate-500">Loading group settings...</p>
        </div>
      </>
    );
  }

  if (!group) return null;

  return (
    <>
      <Header avatarUrl={currentUserAvatar ?? undefined} />

      <main className="max-w-[800px] mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.push(`/groups/${groupId}`)}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors mb-6"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-medium">Back to Chat</span>
        </button>

        {/* Group Info */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
          {/* Group Name */}
          <div className="mb-4">
            {editingName ? (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="flex-1 text-2xl font-bold px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Group name"
                  autoFocus
                />
                <button
                  onClick={handleUpdateGroupName}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingName(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-900">{group.name}</h1>
                {isOwner && (
                  <button
                    onClick={() => {
                      setNewGroupName(group.name);
                      setEditingName(true);
                    }}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Edit group name"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Group Description */}
          <div className="mb-4">
            {editingDescription ? (
              <div className="space-y-2">
                <textarea
                  value={newGroupDescription}
                  onChange={(e) => setNewGroupDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Group description"
                  rows={3}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleUpdateGroupDescription}
                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingDescription(false)}
                    className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3">
                <p className="text-slate-600 flex-1">
                  {group.description || "No description"}
                </p>
                {isOwner && (
                  <button
                    onClick={() => {
                      setNewGroupDescription(group.description || "");
                      setEditingDescription(true);
                    }}
                    className="p-2 rounded-full hover:bg-slate-100 text-slate-600 transition-colors"
                    title="Edit description"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{members.length} {members.length === 1 ? 'member' : 'members'}</span>
            <span>•</span>
            <span>Created {new Date(group.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Add Member (Owner Only) */}
        {isOwner && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm mb-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Add Members</h2>
            <form onSubmit={handleAddMember} className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Search by user's full name..."
                  value={addMemberName}
                  onChange={(e) => {
                    setAddMemberName(e.target.value);
                    setAddMemberEmail(""); // Clear email when name is entered
                  }}
                  className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={searching || !addMemberName.trim()}
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {searching ? "Searching..." : "Add"}
                </button>
              </div>
              <p className="text-sm text-slate-500">
                Enter the user's full name as it appears on their profile (e.g., "John Smith")
              </p>
            </form>
          </div>
        )}

        {/* Members List */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">
            Members ({members.length})
          </h2>

          <div className="space-y-3">
            {/* Owner */}
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3">
                <Avatar
                  src={group.owner_id === currentUserId ? currentUserAvatar ?? undefined : undefined}
                  fallback="O"
                  className="w-10 h-10"
                />
                <div>
                  <p className="font-medium text-slate-900">
                    {group.owner_id === currentUserId ? "You" : "Group Owner"}
                  </p>
                  <p className="text-sm text-slate-500">Owner</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                Owner
              </span>
            </div>

            {/* Regular Members */}
            {members.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={member.profiles.avatar_url ?? undefined}
                    fallback={member.profiles.full_name?.[0] ?? "?"}
                    className="w-10 h-10"
                  />
                  <div>
                    <p className="font-medium text-slate-900">
                      {member.profiles.full_name ?? "Unknown"}
                      {member.user_id === currentUserId && " (You)"}
                    </p>
                    <p className="text-sm text-slate-500 capitalize">
                      {member.profiles.role}
                    </p>
                  </div>
                </div>

                {isOwner && member.user_id !== currentUserId && (
                  <button
                    onClick={() => handleRemoveMember(member.user_id, member.profiles.full_name || "User")}
                    className="px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}

            {members.length === 0 && (
              <p className="text-center text-slate-500 py-8">
                No other members yet. Add some members to get started!
              </p>
            )}
          </div>
        </div>

        {/* Leave Group Button (Non-Owner) */}
        {!isOwner && (
          <div className="mt-6">
            <button
              onClick={handleLeaveGroup}
              className="w-full px-6 py-3 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
            >
              Leave Group
            </button>
          </div>
        )}
      </main>
    </>
  );
}
