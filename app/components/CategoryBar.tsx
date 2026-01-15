'use client'

import React from "react"

type CategoryItem = {
  id?: string
  value?: string
  label: string
  icon?: string
  gradient?: string
  isCreate?: boolean
  isPage?: boolean
}

type CategoryBarProps = {
  categories: CategoryItem[]
  selectedCategory: string
  onSelect: (categoryId: string) => void
  className?: string
}

export function CategoryBar({ categories, selectedCategory, onSelect, className = "" }: CategoryBarProps) {
  const gradientMap: { [key: string]: string } = {
    'Create': 'from-green-400 to-emerald-500',
    'All': 'from-blue-400 to-purple-500',
    'Sports': 'from-green-400 to-blue-500',
    'Gaming': 'from-gray-400 to-gray-600',
    'Crypto': 'from-yellow-400 to-orange-500',
    'Trading': 'from-yellow-400 to-orange-500',
    'Music': 'from-blue-400 to-purple-500',
    'Entertainment': 'from-pink-400 to-red-500',
    'Politics': 'from-green-400 to-teal-500',
    'Tech': 'from-purple-400 to-pink-500',
    'Finance': 'from-green-400 to-emerald-500',
  }

  return (
    <div className={`w-full py-0 ${className}`}>
      <div className="flex justify-center overflow-x-auto md:overflow-visible [&::-webkit-scrollbar]:h-0.5 [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
        <div className="flex gap-0.5">
          {categories.map((category) => {
            const id = category.id || category.value || category.label
            const isSelected = selectedCategory === id
            const gradient = gradientMap[category.label] || 'from-gray-400 to-gray-600'

            let imageSrc = category.icon || ''
            if (!imageSrc.startsWith('/')) {
              imageSrc = `/assets/${imageSrc}`
            }

            return (
              <button
                type="button"
                key={id}
                onClick={() => onSelect(id)}
                className="flex-shrink-0 focus:outline-none transition-transform hover:scale-105"
              >
                <div className="w-6 h-6 rounded-full relative transition-all duration-300">
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${gradient}`} />
                  
                  <div className={`
                    absolute inset-[0.5px] rounded-full flex items-center justify-center 
                    bg-slate-50 dark:bg-slate-900
                    ${isSelected ? 'scale-105' : 'scale-100'} 
                    transition-all duration-300
                  `}>
                    {imageSrc && (
                      <img 
                        src={imageSrc} 
                        alt={category.label} 
                        className="w-3 h-3 object-contain"
                      />
                    )}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CategoryBar


