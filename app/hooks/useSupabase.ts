import { useEffect, useState } from 'react'
import { supabase, UserProfile, UserStats, Referral } from '@/lib/supabase'

export function useUserProfile(userId: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (fetchError) throw fetchError
        setProfile(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch profile')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  return { profile, loading, error }
}

export function useUserStats(userId: string) {
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchStats = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('user_stats')
          .select('*')
          .eq('user_id', userId)
          .single()

        if (fetchError) throw fetchError
        setStats(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  return { stats, loading, error }
}

export function useReferrals(userId: string) {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchReferrals = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', userId)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        setReferrals(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch referrals')
      } finally {
        setLoading(false)
      }
    }

    fetchReferrals()
  }, [userId])

  return { referrals, loading, error }
}

export function useLeaderboard(limit: number = 50) {
  const [leaderboard, setLeaderboard] = useState<(UserProfile & UserStats)[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('user_stats')
          .select(`
            id,
            points,
            wins,
            markets_created,
            total_earned,
            win_rate,
            users (
              id,
              wallet_address,
              username,
              display_name,
              avatar_url
            )
          `)
          .order('points', { ascending: false })
          .limit(limit)

        if (fetchError) throw fetchError
        
        // Transform the data to flatten the nested users object
        const transformedData = (data || []).map((item: any) => ({
          // Use user id as the main id
          id: item.users?.id,
          // UserStats fields
          user_id: item.users?.id, // Redundant but keeping for compatibility
          points: item.points,
          wins: item.wins,
          markets_created: item.markets_created,
          total_earned: item.total_earned,
          win_rate: item.win_rate,
          created_at: item.created_at,
          updated_at: item.updated_at,
          // UserProfile fields (flattened from users object)
          wallet_address: item.users?.wallet_address,
          username: item.users?.username,
          display_name: item.users?.display_name,
          bio: null, // Not selected in query
          avatar_url: item.users?.avatar_url,
        }))
        
        setLeaderboard(transformedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch leaderboard')
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [limit])

  return { leaderboard, loading, error }
}

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchNotifications = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .from('notifications')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError
        
        setNotifications(data || [])
        const unread = (data || []).filter((n) => !n.read).length
        setUnreadCount(unread)
      } catch (err) {
        console.error('Failed to fetch notifications:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [payload.new, ...prev])
          if (!(payload.new as any).read) {
            setUnreadCount((prev) => prev + 1)
          }
        }
      )
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [userId])

  return { notifications, unreadCount, loading }
}

export async function markNotificationAsRead(notificationId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)

  if (error) throw error
}

export async function createUserProfile(
  walletAddress: string,
  username: string,
  displayName: string
) {
  const { data, error } = await supabase
    .from('users')
    .insert([
      {
        wallet_address: walletAddress,
        username,
        display_name: displayName,
      },
    ])
    .select()
    .single()

  if (error) throw error

  // Create initial stats
  const { error: statsError } = await supabase
    .from('user_stats')
    .insert([
      {
        user_id: data.id,
        points: 0,
        wins: 0,
        markets_created: 0,
        total_earned: 0,
        win_rate: 0,
      },
    ])

  if (statsError) throw statsError

  return data
}

export async function updateUserProfile(
  userId: string,
  updates: Partial<UserProfile>
) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function followUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from('user_follows')
    .insert([
      {
        follower_id: followerId,
        following_id: followingId,
      },
    ])

  if (error) throw error
}

export async function unfollowUser(followerId: string, followingId: string) {
  const { error } = await supabase
    .from('user_follows')
    .delete()
    .eq('follower_id', followerId)
    .eq('following_id', followingId)

  if (error) throw error
}
