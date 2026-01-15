"use client"

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { useMiniApp } from '../hooks/useMiniApp'
import { Flame, Search, Trophy, Star, Zap, Wallet, User, Moon, Sun, LogOut, FileText, BarChart3 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function Header() {
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending } = useConnect()
  const { disconnect } = useDisconnect()
  const { isInMiniApp, isReady, user } = useMiniApp()
  const [showWalletOptions, setShowWalletOptions] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDark, setIsDark] = useState(true)
  const router = useRouter()

  // Auto-connect in mini app context
  useEffect(() => {
    if (isReady && isInMiniApp && !isConnected && connectors.length > 0) {
      connect({ connector: connectors[0] })
    }
  }, [isReady, isInMiniApp, isConnected, connect, connectors])

  const shortAddress = address
    ? `${address.slice(0, 6)}...${address.slice(-4)}`
    : ''

  const displayName = user?.displayName || user?.username || shortAddress

  const handleConnect = (connector: typeof connectors[0]) => {
    connect({ connector })
    setShowWalletOptions(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.setAttribute('data-theme', !isDark ? 'light' : 'dark')
  }

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-logo">
          <img
            src="/logo.svg"
            alt="bant-A-bro"
          />
        </div>

        {/* Desktop topbar menu (visible on larger screens) */}
        <nav className="desktop-nav">
          <form onSubmit={handleSearch} className="desktop-search-form">
            <Search size={16} className="desktop-search-icon" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="desktop-search-input"
            />
          </form>
          <Link href="/" className="desktop-nav-link"><Flame size={16} /><span>Challenges</span></Link>
          <Link href="/leaderboard" className="desktop-nav-link"><Trophy size={16} /><span>Leaderboard</span></Link>
          <Link href="/points" className="desktop-nav-link"><Star size={16} /><span>Points</span></Link>
          {isConnected && <Link href="/profile/portfolio" className="desktop-nav-link"><Wallet size={16} /><span>Activity</span></Link>}
        </nav>

        {/* Desktop action buttons (icon only) */}
        <div className="desktop-actions">
          {isConnected && (
            <Link href="/create" className="desktop-icon-btn desktop-create-btn" title="Create">
              <Zap size={18} />
            </Link>
          )}
          {isConnected && (
            <div style={{ position: 'relative' }}>
              <button 
                className="desktop-icon-btn" 
                title="Profile Menu"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <User size={18} />
              </button>
              {showProfileMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '8px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  padding: '8px',
                  minWidth: '180px',
                  zIndex: 100,
                }}>
                  <Link 
                    href="/referrals"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <Flame size={16} />
                    <span>Referrals</span>
                  </Link>
                  <Link 
                    href="/profile/portfolio"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <BarChart3 size={16} />
                    <span>Activity</span>
                  </Link>
                  <Link 
                    href="/profile"
                    onClick={() => setShowProfileMenu(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      textDecoration: 'none',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <FileText size={16} />
                    <span>Edit Profile</span>
                  </Link>
                  <div style={{ borderTop: '1px solid var(--border)', margin: '8px 0' }} />
                  <button 
                    onClick={() => {
                      disconnect()
                      setShowProfileMenu(false)
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      background: 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={16} />
                    <span>Log Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {isConnected ? (
          <button className="wallet-btn btn-press" onClick={() => disconnect()}>
            {user?.pfpUrl ? (
              <img
                src={user.pfpUrl}
                alt=""
                className="wallet-avatar-img"
                style={{ width: 24, height: 24, borderRadius: '50%' }}
              />
            ) : (
              <div className="wallet-avatar" />
            )}
            <span>{displayName}</span>
          </button>
        ) : (
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Mobile icon buttons - hidden on desktop */}
            <Link href="/leaderboard" className="mobile-icon-btn" title="Leaderboard">
              <Trophy size={18} />
            </Link>
            {isConnected && (
              <Link href="/profile" className="mobile-icon-btn" title="Profile">
                <User size={18} />
              </Link>
            )}
            <button
              className="mobile-icon-btn"
              onClick={toggleTheme}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Desktop theme toggle */}
            <button
              className="desktop-icon-btn theme-toggle-btn"
              onClick={toggleTheme}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Connect button */}
            <button
              className="btn btn-primary btn-sm btn-press"
              onClick={() => setShowWalletOptions(!showWalletOptions)}
              disabled={isPending}
            >
              {isPending ? 'Connecting...' : 'Connect'}
            </button>

            {showWalletOptions && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '8px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                padding: '8px',
                minWidth: '180px',
                zIndex: 100,
              }}>
                {connectors.map((connector) => (
                  <button
                    key={connector.uid}
                    onClick={() => handleConnect(connector)}
                    style={{
                      display: 'block',
                      width: '100%',
                      padding: '10px 12px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'var(--text-primary)',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontSize: '14px',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-secondary)'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    {connector.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
