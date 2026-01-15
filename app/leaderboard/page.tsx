'use client'

import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import Link from 'next/link'
import { Trophy } from 'lucide-react'
import { useState } from 'react'
import { ProfileCardModal } from '../components/ProfileCardModal'

export default function LeaderboardPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const entries = [
    { rank: 1, id: 'alice', handle: '@alice', points: 324, markets: 48, wins: 32, earnings: 1240 },
    { rank: 2, id: 'bob', handle: '@bob', points: 290, markets: 42, wins: 28, earnings: 1080 },
    { rank: 3, id: 'carol', handle: '@carol', points: 265, markets: 38, wins: 24, earnings: 960 },
    { rank: 4, id: 'dan', handle: '@dan', points: 240, markets: 35, wins: 20, earnings: 840 },
    { rank: 5, id: 'erin', handle: '@erin', points: 210, markets: 30, wins: 18, earnings: 720 },
  ]

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

        <div className="card leaderboard-card">
          <div className="card-body">
            <div className="leaderboard-list">
              {entries.map((entry) => (
                <button
                  key={entry.rank}
                  className={`leaderboard-item rank-${entry.rank}`}
                  onClick={() => handleUserClick(entry.id)}
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
                    {getMedalIcon(entry.rank)}
                  </div>

                  <div className="leaderboard-avatar">
                    <img
                      src={getAvatarUrl(entry.handle)}
                      alt={entry.handle}
                      className="w-full h-full rounded-10"
                    />
                  </div>

                  <div className="leaderboard-user-info">
                    <div className="leaderboard-handle">{entry.handle}</div>
                  </div>

                  <div className="leaderboard-stat">
                    <span className="stat-value">{entry.markets}</span>
                    <span className="stat-label">Markets</span>
                  </div>

                  <div className="leaderboard-stat">
                    <span className="stat-value">{entry.wins}</span>
                    <span className="stat-label">Wins</span>
                  </div>

                  <div className="leaderboard-stat">
                    <span className="stat-value">{entry.earnings}</span>
                    <span className="stat-label">Earnings</span>
                  </div>

                  <div className="leaderboard-points">
                    <span className="points-value">{entry.points}</span>
                    <span className="points-label">pts</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="leaderboard-actions">
              <Link href="/points" className="btn btn-secondary btn-full">
                View My Points
              </Link>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="leaderboard" />

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
