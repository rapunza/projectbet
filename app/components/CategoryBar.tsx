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
    'All': 'from-blue-500 via-purple-500 to-pink-500',
    'Politics': 'from-blue-600 to-blue-400',
    'Finance': 'from-green-600 to-emerald-400',
    'Sports': 'from-red-600 to-orange-400',
    'Tech': 'from-purple-600 to-pink-400',
    'Entertainment': 'from-yellow-600 to-orange-400',
    'Science': 'from-cyan-600 to-blue-400',
    'Weather': 'from-sky-600 to-cyan-400',
    'Other': 'from-gray-600 to-gray-400',
  }

  return (
    <div className={`w-full flex justify-center py-4 ${className}`}>
      <div className="w-full md:w-auto overflow-x-auto md:overflow-visible overflow-y-hidden px-2 no-scrollbar md:no-scrollbar-none">
        <div className="flex gap-6 justify-center items-start">
          {categories.map((category) => {
            const id = category.id || category.value || category.label
            const isSelected = selectedCategory === id
            const gradient = gradientMap[category.label] || 'from-gray-600 to-gray-400'

            return (
              <button
                type="button"
                key={id}
                onClick={() => onSelect(id)}
                className="flex flex-col items-center gap-2 flex-shrink-0 focus:outline-none"
              >
                {/* Instagram Story Ring */}
                <div className="relative w-20 h-20 flex items-center justify-center">
                  {/* Outer gradient ring */}
                  <div
                    className={`
                      absolute inset-0 rounded-full
                      bg-gradient-to-br ${gradient}
                      transition-all duration-300 ease-out
                      ${isSelected ? 'scale-100' : 'scale-95'}
                    `}
                  />

                  {/* Middle white spacing */}
                  <div
                    className={`
                      absolute inset-1 rounded-full
                      bg-slate-950
                      transition-all duration-300
                    `}
                  />

                  {/* Inner icon circle */}
                  <div
                    className={`
                      absolute inset-3 rounded-full
                      bg-gradient-to-br ${gradient}
                      flex items-center justify-center
                      transition-all duration-300
                      ${isSelected ? 'scale-100' : 'scale-100'}
                    `}
                  />

                  {/* Icon container */}
                  <div className="absolute inset-4 rounded-full bg-slate-950 flex items-center justify-center">
                    {category.icon && (
                      <span className="text-3xl select-none">
                        {category.icon}
                      </span>
                    )}
                  </div>

                  {/* Selection indicator - glow */}
                  {isSelected && (
                    <>
                      <div
                        className={`
                          absolute -inset-1 rounded-full
                          bg-gradient-to-br ${gradient}
                          opacity-20 blur-lg
                          animate-pulse
                        `}
                      />
                      <div
                        className={`
                          absolute inset-0 rounded-full
                          border-2 border-white/30
                          animate-pulse
                        `}
                      />
                    </>
                  )}
                </div>

                {/* Label */}
                <p
                  className={`
                    text-xs font-medium text-center leading-tight max-w-[60px]
                    transition-all duration-300 whitespace-normal
                    ${isSelected ? 'text-white font-semibold' : 'text-white/50'}
                  `}
                >
                  {category.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @media (min-width: 768px) {
          .no-scrollbar-none::-webkit-scrollbar {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default CategoryBar


