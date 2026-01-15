'use client'

import React, { useState } from 'react'
import { X, Trophy, Users, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface CompactProfileCardProps {
  userId: string
  username: string
  avatar: string
  onClose: () => void
  stats?: {
    wins: number
    markets: number
    earnings: number
    points: number
    followers?: number
  }
}

export function CompactProfileCard({
  userId,
  username,
  avatar,
  onClose,
  stats = { wins: 0, markets: 0, earnings: 0, points: 0, followers: 0 }
}: CompactProfileCardProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Card */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-50 pointer-events-none">
        <div
          className="pointer-events-auto bg-card border border-border rounded-16 shadow-lg w-full max-w-sm overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with close button */}
          <div className="relative p-4">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 hover:bg-surface-muted rounded-8 transition"
            >
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          {/* Profile content */}
          <div className="px-4 pb-4 text-center">
            {/* Avatar */}
            <div className="flex justify-center mb-4">
              <img
                src={avatar}
                alt={username}
                className="w-20 h-20 rounded-12 border-3 border-primary/20"
              />
            </div>

            {/* Username */}
            <h2 className="text-lg font-bold text-text-primary mb-1">{username}</h2>
            <p className="text-sm text-text-tertiary mb-6">@{username}</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-surface-muted p-3 rounded-12">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-8 mx-auto mb-2">
                  <Trophy size={16} className="text-primary" />
                </div>
                <div className="text-base font-bold text-text-primary">{stats.wins}</div>
                <div className="text-xs text-text-tertiary">Wins</div>
              </div>

              <div className="bg-surface-muted p-3 rounded-12">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/20 rounded-8 mx-auto mb-2">
                  <TrendingUp size={16} className="text-primary" />
                </div>
                <div className="text-base font-bold text-text-primary">{stats.earnings}</div>
                <div className="text-xs text-text-tertiary">Earned</div>
              </div>

              <div className="bg-surface-muted p-3 rounded-12">
                <div className="text-base font-bold text-text-primary">{stats.markets}</div>
                <div className="text-xs text-text-tertiary">Markets</div>
              </div>

              <div className="bg-surface-muted p-3 rounded-12">
                <div className="text-base font-bold text-primary">{stats.points}</div>
                <div className="text-xs text-text-tertiary">Points</div>
              </div>
            </div>

            {/* View Profile Link */}
            <Link
              href={`/profile?user=${userId}`}
              onClick={onClose}
              className="block w-full py-2 px-4 bg-primary text-black font-semibold rounded-10 hover:opacity-90 transition text-sm"
            >
              View Full Profile
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
