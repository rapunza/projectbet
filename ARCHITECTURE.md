# bant-A-bro - Architecture Overview

## 🏗️ Project Structure

```
callout/
├── app/
│   ├── components/
│   │   ├── Header.tsx                    # Navigation & wallet connection
│   │   ├── ProfileCardModal.tsx          # ✨ NEW: User profile modal
│   │   ├── BottomNav.tsx                 # Mobile navigation
│   │   └── ... (other components)
│   │
│   ├── hooks/
│   │   ├── useContract.ts                # Onchain interactions
│   │   ├── useMiniApp.ts                 # Farcaster Mini App
│   │   └── useSupabase.ts                # ✨ NEW: Offchain data fetching
│   │
│   ├── settings/                         # ✨ NEW: Settings page
│   │   └── page.tsx
│   │
│   ├── referrals/                        # ✨ NEW: Referrals page
│   │   └── page.tsx
│   │
│   ├── leaderboard/
│   │   └── page.tsx                      # Updated: Clickable items
│   │
│   ├── ... (other pages)
│   ├── globals.css                       # Updated: Settings styles
│   ├── layout.tsx
│   └── providers.tsx
│
├── lib/
│   └── supabase.ts                       # ✨ NEW: Supabase client
│
├── contracts/
│   └── contracts/
│       └── PredictionMarkets.sol         # Onchain smart contract
│
├── .env                                  # Updated: Supabase keys
├── package.json                          # Updated: @supabase/supabase-js
│
└── Documentation:
    ├── SUPABASE_SETUP.md                 # ✨ NEW: Database schema
    ├── OFFCHAIN_FEATURES.md              # ✨ NEW: Features overview
    ├── SUPABASE_HOOKS_REFERENCE.md       # ✨ NEW: Hook usage guide
    └── IMPLEMENTATION_CHECKLIST.md       # ✨ NEW: Tasks & progress
```

---

## 🔄 Data Flow Architecture

### Onchain (Smart Contract)
```
User Wallet
    ↓
[Connect Wallet] → wagmi/OnchainKit
    ↓
Smart Contract (Base Sepolia)
├─ createMarket()
├─ placeBet()
├─ resolveMarket()
└─ claimWinnings()
```

### Offchain (Supabase)
```
User Wallet
    ↓
[Create Profile] → createUserProfile()
    ↓
Supabase Database
├─ users (profile data)
├─ user_stats (points, wins, earnings)
├─ referrals (referral relationships)
├─ user_follows (social network)
├─ activity_log (user actions)
└─ notifications (alerts & updates)
```

### Integrated Flow
```
User Action (e.g., place bet)
    ↓
├─ Onchain: placeBet() → Smart Contract
└─ Offchain: logActivity() → Supabase activity_log
    ↓
User Stats Updated
├─ Onchain: Balance reflected on blockchain
└─ Offchain: Leaderboard & stats updated
    ↓
UI Updated
├─ Leaderboard refreshed
├─ Points page updated
└─ Notifications sent
```

---

## 🗄️ Database Schema

### Core Tables

```
┌─────────────────────┐
│      users          │
├─────────────────────┤
│ id (UUID)           │ ← Primary Key
│ wallet_address      │ ← Unique identifier
│ username            │ ← Handle/@username
│ display_name        │
│ bio                 │
│ avatar_url          │
│ created_at          │
│ updated_at          │
└─────────────────────┘
        ↓
        │ references
        ↓
┌──────────────────────────┐
│     user_stats           │
├──────────────────────────┤
│ id (UUID)                │
│ user_id (FK → users)     │
│ points                   │ ← Leaderboard ranking
│ wins                     │ ← Win count
│ markets_created          │ ← Created markets
│ total_earned             │ ← Total winnings
│ win_rate                 │ ← Performance %
│ created_at               │
│ updated_at               │
└──────────────────────────┘

┌────────────────────────┐
│     referrals          │
├────────────────────────┤
│ id (UUID)              │
│ referrer_id (FK)       │ ← Who referred
│ referred_id (FK)       │ ← Who was referred
│ status                 │ ← pending/completed
│ reward                 │ ← $25 per referral
│ created_at             │
│ completed_at           │
└────────────────────────┘

┌──────────────────────────┐
│    user_follows          │
├──────────────────────────┤
│ id (UUID)                │
│ follower_id (FK)         │ ← Who is following
│ following_id (FK)        │ ← Who is being followed
│ created_at               │
└──────────────────────────┘

┌────────────────────────┐
│    activity_log        │
├────────────────────────┤
│ id (UUID)              │
│ user_id (FK)           │
│ action                 │ ← market_created, bet_placed, etc
│ market_id              │ ← Associated market (nullable)
│ metadata               │ ← JSON details
│ created_at             │
└────────────────────────┘

┌─────────────────────────┐
│    notifications        │
├─────────────────────────┤
│ id (UUID)               │
│ user_id (FK)            │
│ type                    │ ← bet_won, market_resolved, etc
│ content                 │ ← Notification text
│ read                    │ ← Status
│ created_at              │
└─────────────────────────┘
```

---

## 🎯 Page Routes Map

```
/                          → Home (Challenges)
├─ /create                 → Create Market (Onchain + Log activity)
├─ /leaderboard            → User Ranking (Offchain)
│  └─ [Click User] → ProfileCardModal (Offchain)
├─ /points                 → My Points (Onchain + Offchain)
├─ /my-bets                → My Portfolio (Onchain)
├─ /market/[id]            → Market Details (Onchain + Offchain)
│
├─ /profile                → User Profile (Onchain + Offchain)
│
├─ /settings               → ✨ NEW Settings (Offchain)
│  ├─ /settings/security   → Password & Auth (Future)
│  ├─ /settings/notifications → Alert preferences (Future)
│  └─ /settings/appearance → Theme & display (Future)
│
├─ /referrals              → ✨ NEW Referral Program (Offchain)
│
├─ /search                 → Market Search (Offchain)
└─ /admin                  → Admin Panel (Onchain)
```

---

## 🔐 Security Architecture

### Row Level Security (RLS) Policies

```
Public Data (Readable by everyone):
├─ users.username, display_name, avatar_url, bio
├─ user_stats (all fields for leaderboard)
└─ referrals (partial - only stats)

Private Data (Readable only by user):
├─ users.wallet_address (only by user or admin)
├─ activity_log (only by the user)
├─ notifications (only by the user)
└─ referrals.completion_details (only by parties involved)
```

### Wallet-Based Authentication
```
User Action
    ↓
[Sign Message with Wallet]
    ↓
Verify Signature
    ↓
Grant Access to User's Data
```

---

## 🚀 Component Communication

### Props Flow

```
Header.tsx
├─ isConnected (wagmi)
├─ address (wagmi)
├─ user (useMiniApp)
└─ [Icons] → Link to /settings, /referrals, etc

LeaderboardPage.tsx
├─ entries (mock data → will use useLeaderboard())
├─ onClick on item
└─ ProfileCardModal
    ├─ userId
    └─ useUserProfile() + useUserStats()

SettingsPage.tsx
├─ disconnect (wagmi)
└─ [Links] to sub-settings pages

ReferralsPage.tsx
├─ address (wagmi)
├─ useReferrals() hook
└─ referral link generation
```

---

## 🔄 Key Features Integration

### Feature: ProfileCardModal
```
User clicks on leaderboard item
    ↓
handleUserClick(userId)
    ↓
setSelectedUserId(userId)
setIsModalOpen(true)
    ↓
<ProfileCardModal userId={userId} isOpen={isModalOpen} />
    ↓
useUserProfile(userId) → Fetch from Supabase
useUserStats(userId) → Fetch from Supabase
    ↓
Display: Avatar, Stats, Follow/Message buttons
```

### Feature: Referral System
```
User visits /referrals
    ↓
address from wagmi
    ↓
Generate referral link: callout.app?ref={address.slice(0,8)}
    ↓
useReferrals(address)
    ↓
Display: Link, Stats, Referred users list
```

### Feature: Settings
```
User visits /settings
    ↓
Display: Account, Preferences, Danger zone
    ↓
User clicks Disconnect
    ↓
disconnect() from wagmi
    ↓
Redirect to home
```

---

## 📊 Data Types & Interfaces

```typescript
// User Profile
interface UserProfile {
  id: string (UUID)
  wallet_address: string (unique)
  username: string (unique)
  display_name: string
  bio: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

// Statistics
interface UserStats {
  id: string (UUID)
  user_id: string (FK)
  points: number
  wins: number
  markets_created: number
  total_earned: number
  win_rate: number (0-1)
  created_at: string
  updated_at: string
}

// Referral
interface Referral {
  id: string (UUID)
  referrer_id: string (FK)
  referred_id: string (FK)
  status: 'pending' | 'completed'
  reward: number (typically 25)
  created_at: string
  completed_at: string | null
}
```

---

## 🎨 UI/UX Layout

### Header (All Pages)
```
┌────────────────────────────────────────────────────────┐
│ [Logo] [Search] [Nav Items] [Icons] [Wallet] [Theme] │
│                                                         │
│ Desktop: Full width with all items                    │
│ Mobile: Compact with menu hamburger                   │
└────────────────────────────────────────────────────────┘
```

### Settings Page
```
┌──────────────────────┐
│  Settings            │
├──────────────────────┤
│ ACCOUNT              │
│ ├─ Profile      →    │
│ └─ Security     →    │
│                      │
│ PREFERENCES          │
│ ├─ Notifications →   │
│ └─ Appearance   →    │
│                      │
│ DANGER ZONE          │
│ └─ [Disconnect]      │
└──────────────────────┘
```

### Referrals Page
```
┌─────────────────────────────────┐
│ Referrals                       │
├─────────────────────────────────┤
│ [24 Total] [18 Completed] [$450]│
│                                 │
│ Your Referral Link              │
│ [link] [Copy Button]            │
│                                 │
│ How It Works                    │
│ 1. Share your link              │
│ 2. They sign up                 │
│ 3. You both earn $25            │
│                                 │
│ Referrals (6 Pending)           │
│ ├─ @sarah  [Completed] +$25     │
│ ├─ @mike   [Completed] +$25     │
│ └─ @emma   [Pending]   +$25     │
└─────────────────────────────────┘
```

### ProfileCardModal
```
┌──────────────────────────────┐
│ [X]                          │ ← Close button
├──────────────────────────────┤
│        [Avatar]              │
│     @username                │ ← Handle
│ [0x1234...5678] [Copy Icon]  │ ← Wallet address
│                              │
│ "User bio here"              │
│                              │
│ [Points] [Wins]              │
│ [Markets] [Win Rate]         │
│                              │
│ [Follow]    [Message]        │
└──────────────────────────────┘
```

---

## ⚡ Performance Optimizations

```
Implemented:
✅ Component lazy loading (next/dynamic)
✅ Image optimization (next/image)
✅ Database indexes on FK fields
✅ RLS policies for efficient queries
✅ Hook memoization with useCallback

To Implement:
⏳ Data caching strategy (TanStack Query)
⏳ Pagination for large lists
⏳ Image optimization with CDN
⏳ Service worker for offline support
```

---

## 🧪 Testing Strategy

```
Unit Tests:
├─ useSupabase hooks
├─ Data transformations
└─ Utility functions

Integration Tests:
├─ Component + API interactions
├─ Modal open/close flow
└─ Data fetching + rendering

E2E Tests:
├─ User signup flow
├─ Settings page navigation
├─ Referral link sharing
└─ Profile modal interaction
```

---

**Created**: January 15, 2026
**Last Updated**: January 15, 2026
**Status**: ✅ Implementation Complete, 🔧 Database Setup Required
