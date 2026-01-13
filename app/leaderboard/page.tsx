'use client'

import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import Link from 'next/link'

export default function LeaderboardPage() {
  const entries = [
    { rank: 1, handle: '@alice', points: 324 },
    { rank: 2, handle: '@bob', points: 290 },
    { rank: 3, handle: '@carol', points: 265 },
    { rank: 4, handle: '@dan', points: 240 },
    { rank: 5, handle: '@erin', points: 210 },
  ]

  return (
    <div className="app">
      <Header />

      <main className="app-content with-bottom-nav">
        <div className="page-header">
          <Link href="/" className="back-btn">←</Link>
          <h1 className="page-title">Leaderboard</h1>
        </div>

        <div className="card">
          <div className="card-body">
            <p style={{ marginBottom: '12px', color: 'var(--text-tertiary)' }}>
              Top users by points — friendly leaderboard UI for now.
            </p>

            <div style={{ width: '100%', overflowX: 'auto' }}>
              <table className="leaderboard-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>User</th>
                    <th>Points</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map(e => (
                    <tr key={e.rank}>
                      <td>{e.rank}</td>
                      <td>{e.handle}</td>
                      <td style={{ fontWeight: 700 }}>{e.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <Link href="/points" className="btn btn-secondary">
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
