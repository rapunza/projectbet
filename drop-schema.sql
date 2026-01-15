-- bant-A-bro - Drop Old Schema (Clean Start)
-- Run this FIRST to remove all old tables
-- Then run schema.sql for the fresh database

-- ========== DROP EXISTING TABLES ==========
-- Drop in reverse order to respect foreign key constraints

DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS market_comments CASCADE;
DROP TABLE IF EXISTS daily_tasks CASCADE;
DROP TABLE IF EXISTS user_streaks CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS activity_log CASCADE;
DROP TABLE IF EXISTS user_follows CASCADE;
DROP TABLE IF EXISTS referrals CASCADE;
DROP TABLE IF EXISTS user_stats CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========== VERIFY ALL TABLES ARE DROPPED ==========
-- After running this script, all tables should be gone
-- Then proceed to run schema.sql
