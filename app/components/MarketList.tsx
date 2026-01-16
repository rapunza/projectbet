'use client'

import Link from 'next/link'
import { PostPreviewCard } from './PostPreviewCard'
import { useMarkets, Market, Category } from '../context/MarketsContext'

// Re-export Market type for compatibility
export type { Market } from '../context/MarketsContext'

interface MarketListProps {
  filter: 'open' | 'resolved' | 'p2p' | 'ended'
  category?: Category
}

export function MarketList({ filter, category }: MarketListProps) {
  const { markets } = useMarkets()

  const now = Date.now()

  const filteredMarkets = markets.filter(m => {
    // Apply status filter
    if (filter === 'open' && m.status !== 'open') return false
    if (filter === 'resolved' && m.status !== 'resolved') return false
    if (filter === 'p2p' && !Boolean(m.creatorAddress)) return false
    if (filter === 'ended' && m.status === 'open' && m.deadline > now) return false
    
    // Apply category filter
    if (category && m.category !== category) return false
    
    return true
  })

  if (filteredMarkets.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📭</div>
        <div className="empty-title">No challenges yet</div>
        <div className="empty-text">
          {filter === 'open' 
            ? 'Be the first to create a challenge!'
            : filter === 'p2p'
              ? 'No P2P challenges yet.'
              : filter === 'ended'
                ? 'No ended challenges to show.'
                : 'No resolved challenges to show.'}
        </div>
        {filter === 'open' && (
          <Link href="/create" className="btn btn-primary" style={{ marginTop: '14px' }}>
            Challenge a friend
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="market-list-grid">
      {filteredMarkets.map((market, index) => (
        <MarketCard key={market.id} market={market} index={index} />
      ))}
    </div>
  )
}

export function MarketCard({ market, index = 0 }: { market: Market; index?: number }) {
  const totalPool = market.yesPool + market.noPool
  const yesPercent = totalPool > 0 ? Math.round((market.yesPool / totalPool) * 100) : 50
  const noPercent = 100 - yesPercent

  const formatPool = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
    return n.toString()
  }

  const timeLeft = market.deadline - Date.now()
  const isExpired = timeLeft <= 0

  // Format time left more accurately
  const formatTimeLeft = () => {
    if (isExpired) return 'Expired'

    const hours = Math.floor(timeLeft / (60 * 60 * 1000))
    const days = Math.floor(hours / 24)
    const remainingHours = hours % 24

    if (days > 0) {
      return `${days}d`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      const minutes = Math.floor(timeLeft / (60 * 1000))
      return `${minutes}m`
    }
  }

  const timeLeftDisplay = formatTimeLeft()

  return (
    <Link href={`/market/${market.id}`} style={{ textDecoration: 'none' }}>
      <div className="card market-card btn-press animate-slide-up" style={{ animationDelay: `${Math.min(index, 4) * 50}ms` }}>
        
        {/* Header Section */}
        <div className="market-card__header">
          <div className="market-card__title-section">
            {/* Cover Image */}
            <div className="market-card__cover-image">
              <img src={market.coverImage || '/assets/bantahblue.svg'} alt={market.question} />
            </div>
            <div className="market-card__title-info">
              <h3 className="market-card__title">{market.question}</h3>
              <div className="market-card__stake-label">
                {formatPool(totalPool)} USDC STAKE
              </div>
            </div>
          </div>

          <div className="market-card__badges">
            {market.status === 'open' && <span className="badge badge--open">🟢 Open</span>}
            {market.creatorAddress && <span className="badge badge--p2p">P2P</span>}
            <button 
              className="market-card__share-btn"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              type="button"
            >
              ⤴️
            </button>
          </div>
        </div>

        {/* VS Section with Pill Buttons */}
        <div className="market-card__vs-section">
          <button className="market-card__option-btn market-card__option-btn--yes">
            <span className="market-card__option-label">YES</span>
            <span className="market-card__option-percent">{yesPercent}%</span>
          </button>

          <div className="market-card__vs">VS</div>

          <button className="market-card__option-btn market-card__option-btn--no">
            <span className="market-card__option-label">NO</span>
            <span className="market-card__option-percent">{noPercent}%</span>
          </button>
        </div>

        {/* Footer Section */}
        <div className="market-card__footer">
          <div className="market-card__footer-item">
            <span className="market-card__footer-label">STAKE</span>
            <span className="market-card__footer-value">{formatPool(market.yesPool)}</span>
          </div>

          <div className="market-card__time">
            {timeLeftDisplay}
          </div>

          <div className="market-card__footer-item market-card__footer-item--win">
            <span className="market-card__footer-label">WIN</span>
            <span className="market-card__footer-value">{formatPool(market.noPool)}</span>
          </div>
        </div>

      </div>
    </Link>
  )
}

