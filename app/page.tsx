'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { BottomNav } from './components/BottomNav'
import { MarketList } from './components/MarketList'
import { Category } from './context/MarketsContext'

export default function Home() {
  const [filter, setFilter] = useState<'open' | 'resolved' | 'p2p' | 'ended'>('open')
  const [category, setCategory] = useState<Category | 'All'>('All')

  return (
    <div className="app">
      <Header />
      
      <main className="app-content with-bottom-nav">

        {/* Status Tabs */}
        <div className="nav-tabs animate-fade-in">
          <button 
            className={`nav-tab btn-press ${filter === 'open' ? 'active' : ''}`}
            onClick={() => setFilter('open')}
          >
            Open Markets
          </button>
          <button 
            className={`nav-tab btn-press ${filter === 'p2p' ? 'active' : ''}`}
            onClick={() => setFilter('p2p')}
          >
            P2P
          </button>
          <button 
            className={`nav-tab btn-press ${filter === 'ended' ? 'active' : ''}`}
            onClick={() => setFilter('ended')}
          >
            Ended
          </button>
          <button 
            className={`nav-tab btn-press ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            Resolved
          </button>
        </div>

        {/* Market List */}
        <MarketList filter={filter} category={category !== 'All' ? category : undefined} />

      </main>

      <BottomNav active="home" />
    </div>
  )
}

