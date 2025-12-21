export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string | null
                    role: 'searcher' | 'investor' | 'broker' | 'seller'
                    linkedin_url: string | null
                    bio: string | null
                    is_verified: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name?: string | null
                    role?: 'searcher' | 'investor' | 'broker' | 'seller'
                    linkedin_url?: string | null
                    bio?: string | null
                    is_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string | null
                    role?: 'searcher' | 'investor' | 'broker' | 'seller'
                    linkedin_url?: string | null
                    bio?: string | null
                    is_verified?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            deals: {
                Row: {
                    id: string
                    owner_id: string
                    title: string
                    description_blind: string
                    description_full: string | null
                    revenue: number | null
                    ebitda: number | null
                    asking_price: number | null
                    status: 'active' | 'under_loi' | 'sold' | 'archived'
                    nda_required: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    owner_id: string
                    title: string
                    description_blind: string
                    description_full?: string | null
                    revenue?: number | null
                    ebitda?: number | null
                    asking_price?: number | null
                    status?: 'active' | 'under_loi' | 'sold' | 'archived'
                    nda_required?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    owner_id?: string
                    title?: string
                    description_blind?: string
                    description_full?: string | null
                    revenue?: number | null
                    ebitda?: number | null
                    asking_price?: number | null
                    status?: 'active' | 'under_loi' | 'sold' | 'archived'
                    nda_required?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            deal_access: {
                Row: {
                    id: string
                    deal_id: string
                    user_id: string
                    status: 'pending' | 'approved' | 'rejected'
                    signed_at: string | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    deal_id: string
                    user_id: string
                    status?: 'pending' | 'approved' | 'rejected'
                    signed_at?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    deal_id?: string
                    user_id?: string
                    status?: 'pending' | 'approved' | 'rejected'
                    signed_at?: string | null
                    created_at?: string
                }
            }
            subscriptions: {
                Row: {
                    user_id: string
                    tier: 'free' | 'pro' | 'enterprise'
                    status: 'active' | 'canceled' | 'past_due' | 'incomplete'
                    stripe_customer_id: string | null
                    stripe_subscription_id: string | null
                    current_period_end: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    user_id: string
                    tier?: 'free' | 'pro' | 'enterprise'
                    status?: 'active' | 'canceled' | 'past_due' | 'incomplete'
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    current_period_end?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    user_id?: string
                    tier?: 'free' | 'pro' | 'enterprise'
                    status?: 'active' | 'canceled' | 'past_due' | 'incomplete'
                    stripe_customer_id?: string | null
                    stripe_subscription_id?: string | null
                    current_period_end?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            posts: {
                Row: {
                    id: string
                    user_id: string
                    content: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    content: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    content?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            comments: {
                Row: {
                    id: string
                    post_id: string
                    user_id: string
                    content: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    post_id: string
                    user_id: string
                    content: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    post_id?: string
                    user_id?: string
                    content?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            likes: {
                Row: {
                    id: string
                    user_id: string
                    post_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    post_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    post_id?: string
                    created_at?: string
                }
            }
            groups: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    owner_id: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    owner_id: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    owner_id?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            group_members: {
                Row: {
                    id: string
                    group_id: string
                    user_id: string
                    role: 'owner' | 'admin' | 'member'
                    created_at: string
                }
                Insert: {
                    id?: string
                    group_id: string
                    user_id: string
                    role?: 'owner' | 'admin' | 'member'
                    created_at?: string
                }
                Update: {
                    id?: string
                    group_id?: string
                    user_id?: string
                    role?: 'owner' | 'admin' | 'member'
                    created_at?: string
                }
            }
            follows: {
                Row: {
                    id: string
                    follower_id: string
                    following_id: string
                    created_at: string
                }
                Insert: {
                    id?: string
                    follower_id: string
                    following_id: string
                    created_at?: string
                }
                Update: {
                    id?: string
                    follower_id?: string
                    following_id?: string
                    created_at?: string
                }
            }
            connections: {
                Row: {
                    id: string
                    requester_id: string
                    receiver_id: string
                    status: 'pending' | 'accepted' | 'rejected'
                    created_at: string
                }
                Insert: {
                    id?: string
                    requester_id: string
                    receiver_id: string
                    status?: 'pending' | 'accepted' | 'rejected'
                    created_at?: string
                }
                Update: {
                    id?: string
                    requester_id?: string
                    receiver_id?: string
                    status?: 'pending' | 'accepted' | 'rejected'
                    created_at?: string
                }
            }
            topics: {
                Row: {
                    id: string
                    name: string
                    category: string
                    post_count: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    category: string
                    post_count?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    category?: string
                    post_count?: number
                    created_at?: string
                }
            }
            notifications: {
                Row: {
                    id: string
                    user_id: string
                    actor_id: string
                    type: 'like' | 'mention' | 'reply' | 'follow' | 'repost'
                    entity_id: string | null
                    entity_type: string | null
                    is_read: boolean
                    metadata: Json
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    actor_id: string
                    type: 'like' | 'mention' | 'reply' | 'follow' | 'repost'
                    entity_id?: string | null
                    entity_type?: string | null
                    is_read?: boolean
                    metadata?: Json
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    actor_id?: string
                    type?: 'like' | 'mention' | 'reply' | 'follow' | 'repost'
                    entity_id?: string | null
                    entity_type?: string | null
                    is_read?: boolean
                    metadata?: Json
                    created_at?: string
                }
            }
        }
    }
}
