'use client'

import { useState } from 'react'
import { Header } from './components/Header'
import { BottomNav } from './components/BottomNav'
import { CategoryBar } from './components/CategoryBar'
import { MarketList } from './components/MarketList'
import { Category } from './context/MarketsContext'

export default function Home() {
  const [filter, setFilter] = useState<'open' | 'resolved' | 'p2p' | 'ended'>('open')
  const [category, setCategory] = useState<Category | 'All'>('All')

  const categoryItems = [
    { label: 'Sports', icon: '/assets/sportscon.svg' },
    { label: 'Gaming', icon: '/assets/gamingsvg.svg' },
    { label: 'Crypto', icon: '/assets/cryptosvg.svg' },
    { label: 'Trading', icon: '/assets/forex.png' },
    { label: 'Music', icon: '/assets/musicsvg.svg' },
    { label: 'Entertainment', icon: '/assets/popcorn.svg' },
    { label: 'Politics', icon: '/assets/poltiii.svg' },
  ]

  return (
    <div className="app">
      <Header />
      
      <main className="app-content with-bottom-nav">

        {/* Category Bar */}
        <div className="md:flex md:justify-center">
          <CategoryBar 
            categories={categoryItems} 
            selectedCategory={category}
            onSelect={(selected) => setCategory(selected as Category | 'All')}
          />
        </div>

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

