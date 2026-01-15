'use client'

import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import Link from 'next/link'
import { Copy, Check, Users, AlertCircle } from 'lucide-react'
import { useState, useMemo, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useReferrals } from '../hooks/useSupabase'
import { supabase } from '@/lib/supabase'
import { SkeletonHeader, SkeletonChart, SkeletonRow } from '../components/Skeletons'

interface ReferralUser {
  id: string
  username: string
  joined_date: string
  status: 'pending' | 'completed'
  reward: number
}

export default function ReferralsPage() {
  const { address } = useAccount()
  const [copied, setCopied] = useState(false)
  const [walletId, setWalletId] = useState<string | null>(null)
  const [fetchingUserId, setFetchingUserId] = useState(true)

  // Fetch user ID from wallet address
  useEffect(() => {
    const fetchUserId = async () => {
      if (!address) {
        setFetchingUserId(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('wallet_address', address.toLowerCase())
          .single()

        if (!error && data) {
          setWalletId(data.id)
        }
      } catch (err) {
        console.error('Failed to fetch user ID:', err)
      } finally {
        setFetchingUserId(false)
      }
    }

    fetchUserId()
  }, [address])

  // Use real referrals data from Supabase
  const { referrals, loading: referralsLoading, error: referralsError } = useReferrals(walletId || '')

  // Calculate stats from real referrals data
  const referralStats = useMemo(() => {
    if (!referrals || referrals.length === 0) {
      return {
        total_referrals: 0,
        completed: 0,
        pending: 0,
        total_earned: 0,
      }
    }

    const completed = referrals.filter((r: any) => r.status === 'completed').length
    const pending = referrals.length - completed
    const total_earned = referrals.reduce((sum: number, r: any) => sum + (r.reward_amount || 25), 0)

    return {
      total_referrals: referrals.length,
      completed,
      pending,
      total_earned,
    }
  }, [referrals])

  // Format referral link
  const referralLink = `https://bant-a-bro.app?ref=${address ? address.slice(2, 10) : 'unknown'}`

  // Transform referrals data for display
  const referredUsers: ReferralUser[] = useMemo(() => {
    if (!referrals || referrals.length === 0) return []
    
    return referrals.map((ref: any) => ({
      id: ref.id,
      username: ref.referred_user?.username || 'Unknown',
      joined_date: ref.created_at ? new Date(ref.created_at).toLocaleDateString() : 'N/A',
      status: ref.status || 'pending',
      reward: ref.reward_amount || 25,
    }))
  }, [referrals])

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Show loading state
  if (fetchingUserId || referralsLoading) {
    return (
      <div className="app">
        <Header />
        <main className="app-content with-bottom-nav">
          <div className="page-header">
            <Link href="/" className="back-btn">
              ←
            </Link>
            <h1 className="page-title">Referrals</h1>
          </div>
          <div style={{ padding: '16px' }}>
            <SkeletonHeader />
            <SkeletonChart />
            <div style={{ marginTop: '24px' }}>
              {[1, 2, 3].map((i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  // Show error state
  if (referralsError) {
    return (
      <div className="app">
        <Header />
        <main className="app-content with-bottom-nav">
          <div className="page-header">
            <Link href="/" className="back-btn">
              ←
            </Link>
            <h1 className="page-title">Referrals</h1>
          </div>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '32px' }}>
              <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {referralsError}
              </p>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  // Show login prompt
  if (!address) {
    return (
      <div className="app">
        <Header />
        <main className="app-content with-bottom-nav">
          <div className="page-header">
            <Link href="/" className="back-btn">
              ←
            </Link>
            <h1 className="page-title">Referrals</h1>
          </div>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                Connect your wallet to view your referrals
              </p>
            </div>
          </div>
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="app">
      <Header />

      <main className="app-content with-bottom-nav">
        <div className="page-header">
          <Link href="/" className="back-btn">
            ←
          </Link>
          <h1 className="page-title">Referrals</h1>
        </div>

        {/* Referral Stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Total Referrals
              </p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>
                {referralStats.total_referrals}
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Completed
              </p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>
                {referralStats.completed}
              </p>
            </div>
          </div>
          <div className="card">
            <div className="card-body" style={{ textAlign: 'center', padding: '16px' }}>
              <p style={{ margin: '0 0 8px 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                Earnings
              </p>
              <p style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: 'var(--primary)' }}>
                ${referralStats.total_earned}
              </p>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-body">
            <h2 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Your Referral Link
            </h2>
            <div
              style={{
                display: 'flex',
                gap: '8px',
                background: 'var(--surface)',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid var(--border)',
              }}
            >
              <input
                type="text"
                value={referralLink}
                readOnly
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  fontFamily: 'monospace',
                }}
              />
              <button
                onClick={copyLink}
                style={{
                  background: 'var(--primary)',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  transition: 'opacity 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        {/* How it Works */}
        <div className="card" style={{ marginBottom: '24px' }}>
          <div className="card-body">
            <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              How It Works
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { step: 1, text: 'Share your referral link with friends' },
                { step: 2, text: 'They sign up and connect their wallet' },
                { step: 3, text: 'You both earn $25 in rewards' },
              ].map((item) => (
                <div key={item.step} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      background: 'var(--primary)',
                      color: 'var(--text-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      fontSize: '12px',
                      fontWeight: 700,
                    }}
                  >
                    {item.step}
                  </div>
                  <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Referred Users */}
        <div className="card">
          <div className="card-body">
            <h2 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: 'var(--text-primary)' }}>
              Your Referrals ({referralStats.pending} Pending)
            </h2>
            {referredUsers.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {referredUsers.map((user) => (
                  <div
                    key={user.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px',
                      background: 'var(--surface)',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                    }}
                  >
                    <div>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {user.username}
                      </p>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-tertiary)' }}>
                        Joined {user.joined_date}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: 'var(--primary)' }}>
                        +${user.reward}
                      </p>
                      <p
                        style={{
                          margin: '4px 0 0 0',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: user.status === 'completed' ? '#10b981' : '#f59e0b',
                          textTransform: 'capitalize',
                        }}
                      >
                        {user.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
                <p style={{ margin: 0, color: 'var(--text-tertiary)' }}>
                  No referrals yet. Share your link to get started!
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
