# bant-A-bro - Quick Reference: Using Supabase Hooks

## Installation
Hooks are ready to use in `/app/hooks/useSupabase.ts`

## Usage Examples

### 1. Fetch User Profile in a Component

```typescript
'use client'

import { useUserProfile } from '@/app/hooks/useSupabase'

export function UserCard({ userId }: { userId: string }) {
  const { profile, loading, error } = useUserProfile(userId)

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!profile) return <div>User not found</div>

  return (
    <div>
      <h2>{profile.display_name}</h2>
      <p>{profile.username}</p>
      <p>{profile.bio}</p>
    </div>
  )
}
```

### 2. Display User Statistics

```typescript
import { useUserStats } from '@/app/hooks/useSupabase'

export function UserStats({ userId }: { userId: string }) {
  const { stats, loading } = useUserStats(userId)

  if (loading) return <div>Loading stats...</div>

  return (
    <div>
      <p>Points: {stats?.points}</p>
      <p>Wins: {stats?.wins}</p>
      <p>Win Rate: {(stats?.win_rate || 0) * 100}%</p>
    </div>
  )
}
```

### 3. Get Referrals for Current User

```typescript
import { useReferrals } from '@/app/hooks/useSupabase'
import { useAccount } from 'wagmi'

export function MyReferrals() {
  const { address } = useAccount()
  const { referrals, loading } = useReferrals(address || '')

  return (
    <div>
      {referrals.map((ref) => (
        <div key={ref.id}>
          <p>{ref.referred_id}</p>
          <p>Status: {ref.status}</p>
          <p>Reward: ${ref.reward}</p>
        </div>
      ))}
    </div>
  )
}
```

### 4. Display Leaderboard with Data

```typescript
import { useLeaderboard } from '@/app/hooks/useSupabase'

export function Leaderboard() {
  const { leaderboard, loading } = useLeaderboard(50)

  return (
    <div>
      {leaderboard.map((user, index) => (
        <div key={user.id}>
          <span>#{index + 1}</span>
          <span>{user.username}</span>
          <span>{user.points} pts</span>
        </div>
      ))}
    </div>
  )
}
```

### 5. Real-Time Notifications with Auto-Refresh

```typescript
import { useNotifications, markNotificationAsRead } from '@/app/hooks/useSupabase'
import { useAccount } from 'wagmi'

export function NotificationCenter() {
  const { address } = useAccount()
  const { notifications, unreadCount } = useNotifications(address || '')

  const handleMarkAsRead = async (notificationId: string) => {
    await markNotificationAsRead(notificationId)
  }

  return (
    <div>
      <p>Unread: {unreadCount}</p>
      {notifications.map((notif) => (
        <div key={notif.id} onClick={() => handleMarkAsRead(notif.id)}>
          <p>{notif.content}</p>
          <p>{notif.type}</p>
        </div>
      ))}
    </div>
  )
}
```

### 6. Create New User Profile on Signup

```typescript
import { createUserProfile } from '@/app/hooks/useSupabase'
import { useAccount } from 'wagmi'

export function SignupForm() {
  const { address } = useAccount()
  const [username, setUsername] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const profile = await createUserProfile(
        address!,
        username,
        username // or use a different display name
      )
      console.log('Profile created:', profile)
    } catch (error) {
      console.error('Failed to create profile:', error)
    }
  }

  return (
    <form onSubmit={handleSignup}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <button type="submit">Create Profile</button>
    </form>
  )
}
```

### 7. Update User Profile

```typescript
import { updateUserProfile } from '@/app/hooks/useSupabase'

async function updateProfile(userId: string) {
  try {
    const updated = await updateUserProfile(userId, {
      display_name: 'New Name',
      bio: 'New bio',
      avatar_url: 'https://example.com/avatar.jpg'
    })
    console.log('Profile updated:', updated)
  } catch (error) {
    console.error('Failed to update:', error)
  }
}
```

### 8. Follow/Unfollow Users

```typescript
import { followUser, unfollowUser } from '@/app/hooks/useSupabase'
import { useAccount } from 'wagmi'

export function UserCard({ userId }: { userId: string }) {
  const { address } = useAccount()

  const handleFollow = async () => {
    if (address) {
      await followUser(address, userId)
    }
  }

  const handleUnfollow = async () => {
    if (address) {
      await unfollowUser(address, userId)
    }
  }

  return (
    <div>
      <button onClick={handleFollow}>Follow</button>
      <button onClick={handleUnfollow}>Unfollow</button>
    </div>
  )
}
```

## Important Notes

### RLS (Row Level Security)
- All tables have RLS enabled for security
- Public data (profiles, stats) is readable by everyone
- Private data (notifications, activity) is only readable by the user

### Real-Time Updates
- `useNotifications()` includes real-time subscription
- New notifications appear instantly without refresh
- Automatically unsubscribes on component unmount

### Error Handling
- All hooks return `error` state for handling failures
- Use try/catch with async functions like `createUserProfile()`
- Always check `loading` state before rendering data

### Type Safety
All hooks are fully typed with TypeScript:
```typescript
interface UserProfile {
  id: string
  wallet_address: string
  username: string
  display_name: string
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}
```

## Common Patterns

### Loading States
```typescript
const { data, loading, error } = useUserProfile(id)

if (loading) return <Skeleton />
if (error) return <Error message={error} />
return <Content data={data} />
```

### Conditional Rendering
```typescript
const { notifications, unreadCount } = useNotifications(userId)

return (
  <>
    {unreadCount > 0 && <Badge count={unreadCount} />}
    {notifications.length > 0 ? (
      <NotificationList items={notifications} />
    ) : (
      <EmptyState />
    )}
  </>
)
```

### Form Submission
```typescript
const [isSubmitting, setIsSubmitting] = useState(false)

const handleSubmit = async () => {
  setIsSubmitting(true)
  try {
    await updateUserProfile(userId, updates)
  } catch (error) {
    // Handle error
  } finally {
    setIsSubmitting(false)
  }
}
```

---

## Need Help?

1. **Check the types**: Open `/app/hooks/useSupabase.ts` to see all available functions
2. **Review examples**: See `/app/components/ProfileCardModal.tsx` for real usage
3. **Read Supabase docs**: https://supabase.com/docs
4. **Check `.env`**: Ensure your Supabase keys are configured
