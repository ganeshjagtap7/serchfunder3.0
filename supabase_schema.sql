-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. PROFILES (Extends auth.users)
create type user_role as enum ('searcher', 'investor', 'broker', 'seller');

create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  role user_role default 'searcher',
  linkedin_url text,
  bio text,
  is_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- 2. DEALS (The Marketplace)
create type deal_status as enum ('active', 'under_loi', 'sold', 'archived');

create table if not exists public.deals (
  id uuid default uuid_generate_v4() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description_blind text not null, -- Public teaser
  description_full text, -- Private, requires NDA/Access
  revenue numeric,
  ebitda numeric,
  asking_price numeric,
  status deal_status default 'active',
  nda_required boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS for Deals
alter table public.deals enable row level security;

create policy "Everyone can view active deals (blind info)"
  on public.deals for select
  using ( status = 'active' or owner_id = auth.uid() );

create policy "Deal owners can insert deals"
  on public.deals for insert
  with check ( auth.uid() = owner_id );

create policy "Deal owners can update their deals"
  on public.deals for update
  using ( auth.uid() = owner_id );

create table if not exists public.deal_details (
  deal_id uuid references public.deals(id) on delete cascade primary key,
  description_full text,
  financials_json jsonb, -- detailed financials
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.deal_details enable row level security;

create policy "Deal owners can view their own deal details"
  on public.deal_details for select
  using ( exists (select 1 from public.deals where id = deal_details.deal_id and owner_id = auth.uid()) );

-- 3. DEAL ACCESS (NDAs)
create type access_status as enum ('pending', 'approved', 'rejected');

create table if not exists public.deal_access (
  id uuid default uuid_generate_v4() primary key,
  deal_id uuid references public.deals(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  status access_status default 'pending',
  signed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(deal_id, user_id)
);

alter table public.deal_access enable row level security;

create policy "Users can see their own access requests"
  on public.deal_access for select
  using ( auth.uid() = user_id );

create policy "Deal owners can see access requests for their deals"
  on public.deal_access for select
  using ( exists (select 1 from public.deals where id = deal_access.deal_id and owner_id = auth.uid()) );

create policy "Users can create access requests"
  on public.deal_access for insert
  with check ( auth.uid() = user_id );

create policy "Approved users can view deal details"
  on public.deal_details for select
  using ( exists (
    select 1 from public.deal_access 
    where deal_id = deal_details.deal_id 
    and user_id = auth.uid() 
    and status = 'approved'
  ));

-- 4. SUBSCRIPTIONS
create type sub_tier as enum ('free', 'pro', 'enterprise');
create type sub_status as enum ('active', 'canceled', 'past_due', 'incomplete');

create table if not exists public.subscriptions (
  user_id uuid references public.profiles(id) on delete cascade primary key,
  tier sub_tier default 'free',
  status sub_status default 'active',
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

create policy "Users can view their own subscription"
  on public.subscriptions for select
  using ( auth.uid() = user_id );

-- 5. POSTS (Community)
create table if not exists public.posts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.posts enable row level security;

create policy "Everyone can view posts"
  on public.posts for select
  using ( true );

create policy "Users can create posts"
  on public.posts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own posts"
  on public.posts for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own posts"
  on public.posts for delete
  using ( auth.uid() = user_id );

-- 6. COMMENTS
create table if not exists public.comments (
  id uuid default uuid_generate_v4() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;

create policy "Everyone can view comments"
  on public.comments for select
  using ( true );

create policy "Users can create comments"
  on public.comments for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own comments"
  on public.comments for delete
  using ( auth.uid() = user_id );

-- 7. LIKES
create table if not exists public.likes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, post_id)
);

alter table public.likes enable row level security;

create policy "Everyone can view likes"
  on public.likes for select
  using ( true );

create policy "Users can insert their own likes"
  on public.likes for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own likes"
  on public.likes for delete
  using ( auth.uid() = user_id );

-- 8. GROUPS
create table if not exists public.groups (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.groups enable row level security;

create policy "Everyone can view groups"
  on public.groups for select
  using ( true );

create policy "Users can create groups"
  on public.groups for insert
  with check ( auth.uid() = owner_id );

create policy "Group owners can update their groups"
  on public.groups for update
  using ( auth.uid() = owner_id );

create policy "Group owners can delete their groups"
  on public.groups for delete
  using ( auth.uid() = owner_id );

-- 9. GROUP MEMBERS
create type member_role as enum ('owner', 'admin', 'member');

create table if not exists public.group_members (
  id uuid default uuid_generate_v4() primary key,
  group_id uuid references public.groups(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role member_role default 'member',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(group_id, user_id)
);

alter table public.group_members enable row level security;

create policy "Everyone can view group members"
  on public.group_members for select
  using ( true );

create policy "Users can join groups"
  on public.group_members for insert
  with check ( auth.uid() = user_id );

create policy "Group owners and admins can manage members"
  on public.group_members for update
  using ( exists (
    select 1 from public.group_members gm
    where gm.group_id = group_members.group_id
    and gm.user_id = auth.uid()
    and gm.role in ('owner', 'admin')
  ));

create policy "Users can leave groups"
  on public.group_members for delete
  using ( auth.uid() = user_id );

-- TRIGGERS for Updated At
create or replace function update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at before update on public.profiles for each row execute function update_updated_at_column();
create trigger update_deals_updated_at before update on public.deals for each row execute function update_updated_at_column();
create trigger update_subscriptions_updated_at before update on public.subscriptions for each row execute function update_updated_at_column();
create trigger update_posts_updated_at before update on public.posts for each row execute function update_updated_at_column();
create trigger update_comments_updated_at before update on public.comments for each row execute function update_updated_at_column();
create trigger update_groups_updated_at before update on public.groups for each row execute function update_updated_at_column();

-- Handle new user signup (auto-create profile)
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', (new.raw_user_meta_data->>'role')::user_role);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function every time a user is created
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
