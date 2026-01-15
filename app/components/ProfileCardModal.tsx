'use client'

import { useEffect, useState } from 'react'
import { X, Copy, Check, AlertCircle } from 'lucide-react'
import { supabase, UserProfile, UserStats } from '@/lib/supabase'
import { SkeletonProfileCard } from './Skeletons'

interface ProfileCardModalProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

export function ProfileCardModal({ userId, isOpen, onClose }: ProfileCardModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfileData()
    }
  }, [isOpen, userId])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch user profile
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) throw new Error('Profile not found')

      // Fetch user stats
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (statsData) {
        setStats(statsData)
      }

      setProfile(profileData)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err instanceof Error ? err.message : 'Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const copyAddress = () => {
    if (profile?.wallet_address) {
      navigator.clipboard.writeText(profile.wallet_address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        backdropFilter: 'blur(4px)',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--bg-card)',
          borderRadius: '16px',
          padding: '24px',
          maxWidth: '420px',
          width: '90%',
          border: '1px solid var(--border)',
          position: 'relative',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--text-secondary)',
            padding: '4px',
            transition: 'color 0.2s',
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        >
          <X size={20} />
        </button>

        {loading ? (
          <div style={{ padding: '12px' }}>
            <SkeletonProfileCard />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
              {error}
            </p>
          </div>
        ) : profile ? (
          <>
            {/* Avatar */}
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <img
                src={
                  profile.avatar_url ||
                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`
                }
                alt={profile.display_name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '12px',
                  marginBottom: '16px',
                  border: '2px solid var(--primary)',
                }}
              />
              <h2 style={{ margin: '0 0 4px 0', color: 'var(--text-primary)', fontSize: '18px', fontWeight: 600 }}>
                {profile.display_name || profile.username}
              </h2>
              <p style={{ margin: '0 0 12px 0', color: 'var(--text-tertiary)', fontSize: '14px' }}>
                @{profile.username}
              </p>

              {/* Wallet address */}
              <button
                onClick={copyAddress}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  margin: '0 auto',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--bg-secondary)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'var(--surface)'
                }}
              >
                {profile.wallet_address.slice(0, 6)}...{profile.wallet_address.slice(-4)}
                {copied ? <Check size={14} /> : <Copy size={14} />}
              </button>
            </div>

            {/* Bio */}
            {profile.bio && (
              <div style={{ marginBottom: '20px' }}>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px', textAlign: 'center' }}>
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Stats */}
            {stats && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginBottom: '20px',
                }}
              >
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Points
                  </p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                    {stats.points || 0}
                  </p>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Wins
                  </p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                    {stats.wins || 0}
                  </p>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Markets
                  </p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                    {stats.markets_created || 0}
                  </p>
                </div>
                <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
                  <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                    Win Rate
                  </p>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: 'var(--primary)' }}>
                    {stats.win_rate ? (stats.win_rate * 100).toFixed(1) : 0}%
                  </p>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'var(--primary)',
                  color: 'var(--text-primary)',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                Follow
              </button>
              <button
                style={{
                  flex: 1,
                  padding: '10px',
                  background: 'var(--surface)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'var(--bg-secondary)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'var(--surface)'
                }}
              >
                Message
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Profile not found</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  )
}
