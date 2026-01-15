'use client'

import { Header } from '../components/Header'
import { BottomNav } from '../components/BottomNav'
import Link from 'next/link'
import { ChevronRight, LogOut, Bell, Lock, User, Palette } from 'lucide-react'
import { useState } from 'react'
import { useDisconnect } from 'wagmi'

interface SettingItem {
  label: string
  icon: React.ReactNode
  description?: string
  href?: string
  onClick?: () => void
}

export default function SettingsPage() {
  const { disconnect } = useDisconnect()
  const [confirming, setConfirming] = useState(false)

  const handleDisconnect = () => {
    setConfirming(true)
    setTimeout(() => {
      disconnect()
    }, 300)
  }

  const accountSettings: SettingItem[] = [
    {
      label: 'Profile',
      icon: <User size={20} />,
      description: 'Edit your profile information',
      href: '/profile',
    },
    {
      label: 'Security',
      icon: <Lock size={20} />,
      description: 'Manage password and login',
      href: '/settings/security',
    },
  ]

  const preferences: SettingItem[] = [
    {
      label: 'Notifications',
      icon: <Bell size={20} />,
      description: 'Manage notification preferences',
      href: '/settings/notifications',
    },
    {
      label: 'Appearance',
      icon: <Palette size={20} />,
      description: 'Theme and display settings',
      href: '/settings/appearance',
    },
  ]

  return (
    <div className="app">
      <Header />

      <main className="app-content with-bottom-nav">
        <div className="page-header">
          <Link href="/" className="back-btn">
            ←
          </Link>
          <h1 className="page-title">Settings</h1>
        </div>

        <div className="card">
          <div className="card-body">
            {/* Account Section */}
            <div className="settings-section">
              <h2 className="settings-section-title">Account</h2>
              <div className="settings-list">
                {accountSettings.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href || '#'}
                    className="settings-item"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div className="settings-item-content">
                      <div className="settings-item-icon">{item.icon}</div>
                      <div className="settings-item-text">
                        <div className="settings-item-label">{item.label}</div>
                        {item.description && (
                          <div className="settings-item-description">{item.description}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="settings-item-arrow" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Preferences Section */}
            <div className="settings-section">
              <h2 className="settings-section-title">Preferences</h2>
              <div className="settings-list">
                {preferences.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href || '#'}
                    className="settings-item"
                    style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                  >
                    <div className="settings-item-content">
                      <div className="settings-item-icon">{item.icon}</div>
                      <div className="settings-item-text">
                        <div className="settings-item-label">{item.label}</div>
                        {item.description && (
                          <div className="settings-item-description">{item.description}</div>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={20} className="settings-item-arrow" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Danger Zone */}
            <div className="settings-section">
              <h2 className="settings-section-title" style={{ color: '#ef4444' }}>
                Danger Zone
              </h2>
              <button
                onClick={handleDisconnect}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: '12px',
                  color: '#ef4444',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                }}
              >
                <LogOut size={18} />
                {confirming ? 'Disconnecting...' : 'Disconnect Wallet'}
              </button>
            </div>
          </div>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
