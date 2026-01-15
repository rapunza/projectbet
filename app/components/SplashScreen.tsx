'use client'

import React, { useEffect, useState } from 'react'

export function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
    }, 1800)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div
      className={`
        fixed inset-0 z-[9999]
        flex flex-col items-center justify-center gap-4
        bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950
        md:hidden
        transition-opacity duration-300
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      {/* Logo/Brand */}
      <div className="text-center">
        <div className="text-5xl font-bold mb-2">
          🎯
        </div>
        <h1 className="text-2xl font-bold text-white mb-1">
          bant-A-bro
        </h1>
        <p className="text-sm text-white/60">
          Prediction Markets
        </p>
      </div>

      {/* Loading Animation */}
      <div className="mt-8 flex gap-2">
        <div
          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.2s' }}
        />
        <div
          className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
          style={{ animationDelay: '0.4s' }}
        />
      </div>

      {/* Optional tagline */}
      <p className="text-xs text-white/50 mt-8">
        Loading your bets...
      </p>
    </div>
  )
}

export default SplashScreen
