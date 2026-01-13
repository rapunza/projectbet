'use client'

import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import Link from 'next/link'

export default function PointsPage() {
  const myPoints = 72
  const recent = [
    { id: 1, action: 'Bet', amount: -10, label: 'Bet YES #123' },
    { id: 2, action: 'Claim', amount: 18, label: 'Claim #98' },
    { id: 3, action: 'Bet', amount: -5, label: 'Bet NO #101' },
  ]

  return (
    <div className="app">
      <Header />

      <main className="app-content with-bottom-nav">
        <div className="page-header">
          <Link href="/" className="back-btn">←</Link>
          <h1 className="page-title">My Points</h1>
        </div>

        <div className="card">
          <div className="card-body">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '13px', color: 'var(--text-tertiary)' }}>Current Points</div>
                <div style={{ fontSize: '28px', fontWeight: 800 }}>{myPoints}</div>
              </div>
              <Link href="/leaderboard" className="btn btn-secondary">View Leaderboard</Link>
            </div>

            <div style={{ marginTop: '8px', color: 'var(--text-tertiary)', marginBottom: '8px' }}>Recent activity</div>
            <ul className="activity-list">
              {recent.map(r => (
                <li key={r.id} className="activity-item">
                  <div>{r.label}</div>
                  <div style={{ fontWeight: 700 }}>{r.amount > 0 ? `+${r.amount}` : r.amount}</div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>

      <BottomNav active="points" />
    </div>
  )
}
