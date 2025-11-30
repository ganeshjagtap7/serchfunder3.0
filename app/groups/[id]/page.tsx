// app/groups/[id]/page.tsx
import Link from "next/link";
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { Database } from "@/types/database";
import GroupMembershipButton from "./GroupMembershipButton";

type Group = Database['public']['Tables']['groups']['Row'];

type GroupPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function GroupPage({ params }: GroupPageProps) {
  const { id: groupId } = await params;
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: group, error: groupError } = await supabase
    .from("groups")
    .select("*")
    .eq("id", groupId)
    .maybeSingle() as { data: Group | null; error: any };

  if (groupError || !group) {
    return (
      <div className="max-w-3xl mx-auto py-10">
        <p className="text-red-500">Group not found.</p>
        <Link href="/groups" className="text-blue-600 underline mt-4 inline-block">
          Back to groups
        </Link>
      </div>
    );
  }

  // Get member count
  const { data: members } = await supabase
    .from("group_members")
    .select("id")
    .eq("group_id", groupId);

  const memberCount = members?.length ?? 0;

  let isMember = false;
  let isOwner = false;

  if (user) {
    // Check if user is the owner
    isOwner = group.owner_id === user.id;

    // Check if user is a member
    const { data: membership } = await supabase
      .from("group_members")
      .select("id")
      .eq("group_id", groupId)
      .eq("user_id", user.id)
      .maybeSingle();

    isMember = !!membership;
  }

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-2">{group.name}</h1>
      <p className="text-slate-600 mb-4">{group.description}</p>
      <p className="text-sm text-slate-500 mb-6">
        {memberCount} member{memberCount === 1 ? "" : "s"}
      </p>

      {/* Only show join/leave button if user is logged in and not the owner */}
      {user && !isOwner && (
        <GroupMembershipButton
          groupId={groupId}
          isMemberInitially={isMember}
        />
      )}

      {/* Show owner badge */}
      {isOwner && (
        <div className="mb-4 px-4 py-2 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-800 font-medium">You own this group</p>
        </div>
      )}

      {/* Show login message if not authenticated */}
      {!user && (
        <div className="mb-4 px-4 py-2 bg-slate-50 border border-slate-200 rounded-md">
          <p className="text-sm text-slate-600">
            <a href="/login" className="text-blue-600 hover:underline">Log in</a> to join this group
          </p>
        </div>
      )}

      <div className="mt-8 border-t border-slate-200 pt-6">
        {isMember ? (
          <p className="text-slate-700">
            You&apos;re a member of this group. (Next we&apos;ll show group posts here.)
          </p>
        ) : (
          <p className="text-slate-500">
            Join this group to see posts and participate in discussions.
          </p>
        )}
      </div>
    </div>
  );
}
