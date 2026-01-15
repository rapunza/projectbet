'use client'

import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import Link from 'next/link'
import { Star, TrendingUp, TrendingDown } from 'lucide-react'

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

        <div className="card points-card">
          <div className="card-body">
            {/* Points Display */}
            <div className="points-display">
              <div className="points-display-content">
                <div className="points-label">Current Balance</div>
                <div className="points-amount">{myPoints}</div>
                <div className="points-unit">Points</div>
              </div>
              <Star className="points-icon" />
            </div>

            {/* Recent Activity */}
            <div className="points-activity">
              <div className="activity-header">
                <h3 className="activity-title">Recent Activity</h3>
                <Link href="/leaderboard" className="btn btn-secondary btn-sm">
                  View Leaderboard
                </Link>
              </div>

              <ul className="activity-list">
                {recent.map((item) => (
                  <li key={item.id} className="activity-item">
                    <div className="activity-item-icon">
                      {item.amount > 0 ? (
                        <TrendingUp size={16} className="icon-positive" />
                      ) : (
                        <TrendingDown size={16} className="icon-negative" />
                      )}
                    </div>
                    <div className="activity-item-content">
                      <div className="activity-item-label">{item.label}</div>
                      <div className="activity-item-action">{item.action}</div>
                    </div>
                    <div className={`activity-item-amount ${item.amount > 0 ? 'positive' : 'negative'}`}>
                      {item.amount > 0 ? `+${item.amount}` : item.amount}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="points" />
    </div>
  )
}
