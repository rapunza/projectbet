'use client'

import React from 'react'

export function SkeletonCard() {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 mb-3 animate-pulse">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 bg-slate-700 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-slate-700 rounded w-3/4 mb-2" />
          <div className="h-3 bg-slate-700 rounded w-1/2" />
        </div>
      </div>
      <div className="h-16 bg-slate-700 rounded-lg mb-3" />
      <div className="flex gap-2">
        <div className="flex-1 h-8 bg-slate-700 rounded" />
        <div className="flex-1 h-8 bg-slate-700 rounded" />
      </div>
    </div>
  )
}

export function SkeletonHeader() {
  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-4 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-2/3 mb-2" />
      <div className="h-4 bg-slate-700 rounded w-1/2" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 bg-slate-800 rounded-lg mb-2 animate-pulse">
      <div className="w-12 h-12 bg-slate-700 rounded-full" />
      <div className="flex-1">
        <div className="h-4 bg-slate-700 rounded w-2/3 mb-2" />
        <div className="h-3 bg-slate-700 rounded w-1/2" />
      </div>
      <div className="w-16 h-6 bg-slate-700 rounded" />
    </div>
  )
}

export function SkeletonTabs() {
  return (
    <div className="flex gap-2 mb-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex-1 h-10 bg-slate-700 rounded-lg" />
      ))}
    </div>
  )
}

export function SkeletonChart() {
  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-4 animate-pulse">
      <div className="h-4 bg-slate-700 rounded w-1/3 mb-4" />
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex gap-2">
            <div className="w-8 h-6 bg-slate-700 rounded" />
            <div className="flex-1 h-6 bg-slate-700 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

export function SkeletonProfileCard() {
  return (
    <div className="bg-slate-800 rounded-2xl p-4 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 bg-slate-700 rounded-full" />
        <div className="h-4 bg-slate-700 rounded w-2/3" />
        <div className="h-3 bg-slate-700 rounded w-1/2" />
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-slate-700 rounded-lg p-3 text-center">
            <div className="h-3 bg-slate-600 rounded mb-2" />
            <div className="h-4 bg-slate-600 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}
