import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface UserProfile {
  id: string
  wallet_address: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export interface UserStats {
  id: string
  user_id: string
  points: number
  wins: number
  markets_created: number
  total_earned: number
  win_rate: number
  created_at: string
  updated_at: string
}

export interface Referral {
  id: string
  referrer_id: string
  referred_id: string
  status: 'pending' | 'completed'
  reward: number
  created_at: string
  completed_at: string | null
}

export interface UserFollows {
  id: string
  follower_id: string
  following_id: string
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  market_id: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: string
  content: string
  read: boolean
  created_at: string
}
