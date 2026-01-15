'use client'

import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import Link from 'next/link'
import { Trophy, Medal } from 'lucide-react'

export default function LeaderboardPage() {
  const entries = [
    { rank: 1, handle: '@alice', points: 324 },
    { rank: 2, handle: '@bob', points: 290 },
    { rank: 3, handle: '@carol', points: 265 },
    { rank: 4, handle: '@dan', points: 240 },
    { rank: 5, handle: '@erin', points: 210 },
  ]

  const getMedalIcon = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return `${rank}`
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
            <div className="leaderboard-header">
              <Trophy size={24} className="leaderboard-icon" />
              <p className="leaderboard-subtitle">Top users by points</p>
            </div>

            <div className="leaderboard-list">
              {entries.map((entry) => (
                <div key={entry.rank} className={`leaderboard-item rank-${entry.rank}`}>
                  <div className="leaderboard-rank-badge">
                    {getMedalIcon(entry.rank)}
                  </div>
                  <div className="leaderboard-user-info">
                    <div className="leaderboard-handle">{entry.handle}</div>
                    <div className="leaderboard-rank-text">Rank #{entry.rank}</div>
                  </div>
                  <div className="leaderboard-points">
                    <span className="points-value">{entry.points}</span>
                    <span className="points-label">pts</span>
                  </div>
                </div>
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
    </div>
  )
}
