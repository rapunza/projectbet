'use client'

import { ExternalLink } from 'lucide-react'

export type Platform = 'base' | 'twitter'

interface PostPreviewCardProps {
  postUrl: string
  authorHandle: string
  postText: string
  postedAt?: string // Optional: ISO string or relative time like "2h ago"
  platform?: Platform // 'base' or 'twitter'
  compact?: boolean // For in-card usage (smaller sizing)
  avatarUrl?: string // Optional: avatar URL for compact mode
}

export function PostPreviewCard({
  postUrl,
  authorHandle,
  postText,
  postedAt,
  platform = 'base',
  compact = false,
  avatarUrl,
}: PostPreviewCardProps) {
  const handleViewPost = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open(postUrl, '_blank', 'noopener,noreferrer')
  }

  const platformIcon = platform === 'twitter' ? '𝕏' : '🔵'
  const platformLabel = platform === 'twitter' ? 'Twitter' : 'Base'
  const actionLabel = platform === 'twitter' ? 'View tweet' : 'View post'

  // Format date to shorter format
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return ''
    
    // If it's already a relative time format like "2h ago", return as is
    if (dateStr.includes('ago') || dateStr.includes('d') || dateStr.includes('h') || dateStr.includes('m')) {
      return dateStr
    }
    
    // Parse ISO string and format to relative time
    try {
      const date = new Date(dateStr)
      const now = new Date()
      const diffMs = now.getTime() - date.getTime()
      const diffMins = Math.floor(diffMs / (1000 * 60))
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

      if (diffMins < 1) return 'now'
      if (diffMins < 60) return `${diffMins}m`
      if (diffHours < 24) return `${diffHours}h`
      if (diffDays < 7) return `${diffDays}d`
      
      // Fallback to short date format
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    } catch {
      return dateStr
    }
  }

  const formattedTime = formatDate(postedAt)

  return (
    <div className={`post-preview ${compact ? 'post-preview--compact' : ''}`}>
      {/* Content Section */}
      <div className="post-preview__content">
        {/* Platform Badge + Meta Row */}
        <div className="post-preview__meta">
          {compact && avatarUrl ? (
            <img src={avatarUrl} alt={authorHandle} className="post-preview__avatar" />
          ) : (
            <span className="post-preview__platform" title={platformLabel}>
              {platformIcon}
            </span>
          )}
          <span className="post-preview__handle">{authorHandle}</span>
          {formattedTime && (
            <>
              <span className="post-preview__dot">·</span>
              <span className="post-preview__time">{formattedTime}</span>
            </>
          )}
        </div>

        {/* Post Snippet (clamped to 2-3 lines) */}
        <p className="post-preview__text">{postText}</p>

        {/* Action: View Post */}
        {!compact ? (
          <button
            className="post-preview__action btn-press"
            onClick={handleViewPost}
            type="button"
          >
            <ExternalLink size={14} />
            <span>{actionLabel}</span>
          </button>
        ) : (
          <button
            className="post-preview__action-icon btn-press"
            onClick={handleViewPost}
            type="button"
            title={actionLabel}
            aria-label={actionLabel}
          >
            <ExternalLink size={16} />
          </button>
        )}
      </div>
    </div>
  )
}
