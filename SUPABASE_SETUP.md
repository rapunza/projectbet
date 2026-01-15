# bant-A-bro - Supabase Database Setup Guide

## Supabase Project Details
- **URL**: https://ftggmzsvsomtnjmdswvw.supabase.co
- **Publishable Key**: sb_publishable_QTe7FrfYxWqBIVjWGc5fOA_h4TvAMTM
- **Anon Key**: Already configured in `.env` as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Service Role Key**: Already configured in `.env` as `SUPABASE_SERVICE_ROLE_KEY`

## SQL Schema to Create

Run these SQL commands in the Supabase SQL Editor to set up the required tables:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Statistics table
CREATE TABLE user_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  points INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  markets_created INTEGER DEFAULT 0,
  total_earned DECIMAL(18, 2) DEFAULT 0,
  win_rate DECIMAL(5, 2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Referrals table
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  reward DECIMAL(18, 2) DEFAULT 25,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(referrer_id, referred_id)
);

-- User Follows table
CREATE TABLE user_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- Activity Log table
CREATE TABLE activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  market_id TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (allow authenticated users to read public data)
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "User stats are viewable by everyone" ON user_stats FOR SELECT USING (true);
CREATE POLICY "Referrals are viewable by referrer and referee" ON referrals FOR SELECT USING (
  auth.uid() = referrer_id OR auth.uid() = referred_id
);
CREATE POLICY "Activity logs are viewable by the user" ON activity_log FOR SELECT USING (
  auth.uid() = user_id
);
CREATE POLICY "Notifications are viewable by the user" ON notifications FOR SELECT USING (
  auth.uid() = user_id
);

-- Create indexes for better performance
CREATE INDEX idx_user_stats_user_id ON user_stats(user_id);
CREATE INDEX idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred_id ON referrals(referred_id);
CREATE INDEX idx_user_follows_follower_id ON user_follows(follower_id);
CREATE INDEX idx_user_follows_following_id ON user_follows(following_id);
CREATE INDEX idx_activity_log_user_id ON activity_log(user_id);
CREATE INDEX idx_activity_log_created_at ON activity_log(created_at);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
```

## Steps to Set Up

1. **Go to Supabase Dashboard**
   - Navigate to https://app.supabase.com
   - Select your project

2. **Open SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Create a new query

3. **Copy and Run the Schema**
   - Copy the SQL schema above
   - Paste it into the SQL editor
   - Click "Run" to execute

4. **Verify Tables**
   - Go to "Table Editor"
   - You should see all 6 tables created:
     - `users`
     - `user_stats`
     - `referrals`
     - `user_follows`
     - `activity_log`
     - `notifications`

## Environment Variables

Your `.env` file is already configured with:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Features Ready to Use

The following components and pages are now ready:

### Pages
- **`/settings`** - Settings page with account, preferences, and danger zone
- **`/referrals`** - Referral program with link sharing and user list
- **Profile Card Modal** - Click on any user in leaderboard to see their profile

### Components
- **`ProfileCardModal`** - Displays user profile with stats (Follow/Message buttons)
- Settings with organized sections

### Database Functions Ready
- User profile management
- Stats tracking
- Referral system
- Activity logging
- Notifications
- User follows/network

## Next Steps

1. Run the SQL schema in Supabase
2. Test the `/settings` and `/referrals` pages
3. Click on leaderboard users to view their profile modal
4. Add authentication handlers to create/update user profiles
5. Implement Supabase hooks for data fetching in components
