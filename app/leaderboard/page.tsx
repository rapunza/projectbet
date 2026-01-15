'use client'

import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import Link from 'next/link'
import { Trophy, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { ProfileCardModal } from '../components/ProfileCardModal'
import { useLeaderboard } from '../hooks/useSupabase'
import { SkeletonRow, SkeletonTabs } from '../components/Skeletons'

export default function LeaderboardPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Fetch real leaderboard data
  const { leaderboard, loading, error } = useLeaderboard(50)

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}`
  }

  const getAvatarUrl = (username: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`
  }

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId)
    setIsModalOpen(true)
  }

  return (
    <div className="app">
      <Header />

      <main className="app-content with-bottom-nav">
        <div className="page-header">
          <Link href="/" className="back-btn">←</Link>
          <h1 className="page-title">Leaderboard</h1>
        </div>

        {loading ? (
          <div className="card leaderboard-card">
            <div className="card-body" style={{ padding: '16px' }}>
              <SkeletonTabs />
              {[1, 2, 3, 4, 5].map((i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="card leaderboard-card">
            <div className="card-body" style={{ textAlign: 'center', padding: '32px' }}>
              <AlertCircle size={40} style={{ margin: '0 auto 12px', opacity: 0.5 }} />
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                {error}
              </p>
            </div>
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="card leaderboard-card">
            <div className="card-body" style={{ textAlign: 'center', padding: '48px 24px' }}>
              <Trophy size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
              <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
                No leaderboard data available
              </p>
            </div>
          </div>
        ) : (
          <div className="card leaderboard-card">
            <div className="card-body">
              <div className="leaderboard-list">
                {leaderboard.map((entry, index) => {
                  const userId = (entry as any).id
                  const username = (entry as any).username || (entry as any).display_name || 'Unknown'
                  const points = entry.points || 0
                  const wins = entry.wins || 0
                  const marketsCreated = entry.markets_created || 0
                  const totalEarned = entry.total_earned || 0
                  const rank = index + 1

                  return (
                    <button
                      key={userId}
                      className={`leaderboard-item rank-${rank}`}
                      onClick={() => handleUserClick(userId)}
                      style={{
                        background: 'inherit',
                        border: 'inherit',
                        cursor: 'pointer',
                        width: '100%',
                        textAlign: 'left',
                        padding: 'inherit',
                      }}
                    >
                      <div className="leaderboard-rank-badge">
                        {getMedalIcon(rank)}
                      </div>

                      <div className="leaderboard-avatar">
                        <img
                          src={getAvatarUrl(username)}
                          alt={username}
                          className="w-full h-full rounded-10"
                        />
                      </div>

                      <div className="leaderboard-user-info">
                        <div className="leaderboard-handle">@{username}</div>
                      </div>

                      <div className="leaderboard-stat">
                        <span className="stat-value">{marketsCreated}</span>
                        <span className="stat-label">Markets</span>
                      </div>

                      <div className="leaderboard-stat">
                        <span className="stat-value">{wins}</span>
                        <span className="stat-label">Wins</span>
                      </div>

                      <div className="leaderboard-stat">
                        <span className="stat-value">{totalEarned}</span>
                        <span className="stat-label">Earnings</span>
                      </div>

                      <div className="leaderboard-points">
                        <span className="points-value">{points}</span>
                        <span className="points-label">pts</span>
                      </div>
                    </button>
                  )
                })}
              </div>

              <div className="leaderboard-actions">
                <Link href="/points" className="btn btn-secondary btn-full">
                  View My Points
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />

      {selectedUserId && (
        <ProfileCardModal
          userId={selectedUserId}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
