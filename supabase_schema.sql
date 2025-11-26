-- Create likes table
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id)
);

-- Enable RLS
alter table public.likes enable row level security;

-- Policies
create policy "Users can insert their own likes"
on public.likes for insert
to authenticated
with check ( auth.uid() = user_id );

create policy "Users can delete their own likes"
on public.likes for delete
to authenticated
using ( auth.uid() = user_id );

create policy "Everyone can view likes"
on public.likes for select
to authenticated, anon
using ( true );

-- Add Foreign Key from posts to profiles (if not already exists, for easier joining)
-- Note: This assumes profiles.id is the same as auth.users.id
alter table public.posts
add constraint posts_user_id_fkey_profiles
foreign key (user_id)
references public.profiles(id)
on delete cascade;

-- Add Foreign Key from comments to profiles
alter table public.comments
add constraint comments_user_id_fkey_profiles
foreign key (user_id)
references public.profiles(id)
on delete cascade;
