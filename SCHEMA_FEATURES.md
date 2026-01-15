# bant-A-bro Database Schema - Feature Coverage

## Features Implemented in Schema

### ✅ User Management
- **users** - Profile data (username, display_name, bio, avatar_url)
- **user_stats** - Points, wins, markets created, earnings
- Profile editing support via users table

### ✅ Social Features
- **user_follows** - Follow/unfollow relationships
- **user_streaks** - Login streaks and daily tracking
- Follower/following counts derivable from queries

### ✅ Referral System
- **referrals** - Referral relationships with rewards ($25 per referral)
- Track referral status (pending/completed)
- Reward points for referring users

### ✅ Daily Tasks & Login
- **daily_tasks** - Daily login rewards, task completion tracking
- Task types: daily_login, create_market, place_bet, invite_friend, etc.
- Reward points for each task (configurable)
- Automatic expiration for daily tasks
- Task completion tracking with timestamps

### ✅ Comments & Chat
- **market_comments** - Users can comment/chat on challenge details pages
- Comments tied to specific market_id
- Timestamps and edit tracking
- Like system for comments

### ✅ Comment Interactions
- **comment_likes** - Users can like comments
- Automatic like count on market_comments
- Unique constraint to prevent duplicate likes

### ✅ Notifications
- **notifications** - Toast notifications and alerts
- Notification types: bet_won, market_resolved, referral_completed, etc.
- Read/unread status tracking
- Timestamp tracking for notification ordering

### ✅ Activity Tracking
- **activity_log** - Track user actions
- Log types: market_created, bet_placed, bet_won, comment_posted, task_completed
- Metadata JSONB for flexible data storage
- Chronological ordering

### ✅ Points System (Onchain Integration Ready)
- **user_stats.points** - Onchain points will update this
- **daily_tasks** - Earn points for daily tasks (offchain)
- **referrals.reward** - Earn points for referrals (offchain)
- Points aggregation happens in application logic

---

## Table Overview

| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | User profiles | Wallet, username, display name, avatar, bio |
| `user_stats` | User statistics | Points, wins, earnings, win rate |
| `user_follows` | Social network | Follow/unfollow relationships |
| `user_streaks` | Login tracking | Daily login streaks, longest streak |
| `daily_tasks` | Task system | Daily challenges, rewards, expiration |
| `referrals` | Referral program | Referrer/referee relationships, rewards |
| `market_comments` | Discussion | Chat on challenges, likes, timestamps |
| `comment_likes` | Comment interactions | Like tracking, user attribution |
| `activity_log` | Audit trail | User actions, market interactions |
| `notifications` | Alerts | System notifications, read status |

---

## RLS Policies

### Public Data (Everyone can view)
- `users` - Profile information
- `user_stats` - Leaderboard data
- `user_streaks` - Streak achievements
- `market_comments` - Challenge discussions
- `comment_likes` - Like data

### Private Data (Only user can view)
- `activity_log` - Personal action history
- `notifications` - Personal alerts
- `daily_tasks` - Personal tasks

### Shared Data (Both parties can view)
- `referrals` - Referrer and referee both see it
- `user_follows` - Both parties can view the follow relationship

---

## Future Enhancements

Ready to add when needed:
- Direct messaging between users (messages table)
- User badges/achievements (badges table)
- Market categories/tags (tags table)
- User settings preferences (user_settings table)
- Content moderation flags (moderation_flags table)
- Leaderboard snapshots for historical tracking (leaderboard_snapshots table)

---

## Ready to Deploy

✅ All tables created with proper relationships
✅ Foreign key constraints for data integrity
✅ RLS policies for security
✅ Performance indexes on frequently queried fields
✅ Unique constraints to prevent duplicates
✅ CHECK constraints for valid values

**Next Step**: Copy schema.sql and run in Supabase SQL Editor
