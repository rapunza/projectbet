'use client'

import Link from 'next/link'
import { Home, Search, Plus, BarChart3, Coins } from 'lucide-react'

interface BottomNavProps {
  active?: 'home' | 'search' | 'portfolio' | 'points'
}

export function BottomNav({ active }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-inner">
        {/* Left group */}
        <Link 
          href="/" 
          className={`bottom-nav-item btn-press ${active === 'home' ? 'active' : ''}`}
        >
          {active === 'home' && <span className="bottom-nav-indicator" />}
          <Home size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Challenges</span>
        </Link>
        
        <Link 
          href="/search" 
          className={`bottom-nav-item btn-press ${active === 'search' ? 'active' : ''}`}
        >
          {active === 'search' && <span className="bottom-nav-indicator" />}
          <Search size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Search</span>
        </Link>

        {/* Center action button */}
        <div className="bottom-nav-center">
          <Link 
            href="/create" 
            className="bottom-nav-fab btn-press"
            aria-label="Create market"
          >
            <Plus size={24} strokeWidth={2.5} />
          </Link>
        </div>

        {/* Right group */}
        <Link 
          href="/points" 
          className={`bottom-nav-item btn-press ${active === 'points' ? 'active' : ''}`}
        >
          {active === 'points' && <span className="bottom-nav-indicator" />}
          <Coins size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Points</span>
        </Link>

        <Link 
          href="/profile/portfolio" 
          className={`bottom-nav-item btn-press ${active === 'portfolio' ? 'active' : ''}`}
        >
          {active === 'portfolio' && <span className="bottom-nav-indicator" />}
          <BarChart3 size={20} className="bottom-nav-icon" />
          <span className="bottom-nav-label">Activity</span>
        </Link>
      </div>
    </nav>
  )
}
