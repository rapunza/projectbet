'use client'

import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react'

// Platform type
export type Platform = 'base' | 'twitter'

// Category type
export type Category = 'Politics' | 'Finance' | 'Sports' | 'Tech' | 'Entertainment' | 'Science' | 'Weather' | 'Other'

// Market type
export interface Market {
  id: number
  question: string
  postUrl: string
  authorHandle: string
  postText: string
  postedAt?: string
  platform: Platform
  deadline: number
  status: 'open' | 'locked' | 'resolved'
  outcomeYes: boolean
  yesPool: number
  noPool: number
  creatorAddress?: string
  category?: Category
}

// User bet type
export interface UserBet {
  marketId: number
  question: string
  side: 'yes' | 'no'
  stake: number
  status: 'open' | 'won' | 'lost'
  payout?: number
  claimed?: boolean
}

// Portfolio history entry for chart
export interface PortfolioHistoryEntry {
  timestamp: number
  balance: number
  action: 'bet' | 'claim' | 'initial'
  amount: number
  marketId?: number
}

// Initial demo markets - Empty for production
const INITIAL_MARKETS: Market[] = []

// Initial demo user bets - Empty for production
const INITIAL_BETS: UserBet[] = []

interface MarketsContextType {
  markets: Market[]
  userBets: UserBet[]
  portfolioBalance: number
  portfolioHistory: PortfolioHistoryEntry[]
  totalWinnings: number
  totalStaked: number
  addMarket: (market: Omit<Market, 'id' | 'status' | 'outcomeYes' | 'yesPool' | 'noPool'> & { initialStake: number; platform: Platform }) => number
  addBet: (marketId: number, side: 'yes' | 'no', stake: number) => void
  getMarket: (id: number) => Market | undefined
  resolveMarket: (marketId: number, outcomeYes: boolean) => Promise<void>
  claimWinnings: (marketId: number) => Promise<{ payout: number; claimed: boolean }>
  getUserBetsForMarket: (marketId: number) => UserBet[]
}

const MarketsContext = createContext<MarketsContextType | null>(null)

// LocalStorage keys
const STORAGE_KEYS = {
  MARKETS: 'voucheo_markets',
  BETS: 'voucheo_bets',
  NEXT_ID: 'voucheo_next_id',
  PORTFOLIO_BALANCE: 'voucheo_portfolio_balance',
  PORTFOLIO_HISTORY: 'voucheo_portfolio_history',
}

// Initial portfolio balance - 0 for production (users use real USDC)
const INITIAL_PORTFOLIO_BALANCE = 0

// Initial portfolio history - Empty for production
const INITIAL_PORTFOLIO_HISTORY: PortfolioHistoryEntry[] = []

// Helper to load from localStorage
function loadFromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const stored = localStorage.getItem(key)
    return stored ? JSON.parse(stored) : fallback
  } catch {
    return fallback
  }
}

export function MarketsProvider({ children }: { children: ReactNode }) {
  const [markets, setMarkets] = useState<Market[]>(INITIAL_MARKETS)
  const [userBets, setUserBets] = useState<UserBet[]>(INITIAL_BETS)
  const [nextId, setNextId] = useState(100)
  const [portfolioBalance, setPortfolioBalance] = useState(INITIAL_PORTFOLIO_BALANCE)
  const [portfolioHistory, setPortfolioHistory] = useState<PortfolioHistoryEntry[]>(INITIAL_PORTFOLIO_HISTORY)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const storedMarkets = loadFromStorage<Market[]>(STORAGE_KEYS.MARKETS, INITIAL_MARKETS)
    const storedBets = loadFromStorage<UserBet[]>(STORAGE_KEYS.BETS, INITIAL_BETS)
    const storedNextId = loadFromStorage<number>(STORAGE_KEYS.NEXT_ID, 100)
    const storedBalance = loadFromStorage<number>(STORAGE_KEYS.PORTFOLIO_BALANCE, INITIAL_PORTFOLIO_BALANCE)
    const storedHistory = loadFromStorage<PortfolioHistoryEntry[]>(STORAGE_KEYS.PORTFOLIO_HISTORY, INITIAL_PORTFOLIO_HISTORY)

    setMarkets(storedMarkets)
    setUserBets(storedBets)
    setNextId(storedNextId)
    setPortfolioBalance(storedBalance)
    setPortfolioHistory(storedHistory)
    setIsHydrated(true)
  }, [])

  // Save to localStorage when state changes
  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(STORAGE_KEYS.MARKETS, JSON.stringify(markets))
  }, [markets, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(STORAGE_KEYS.BETS, JSON.stringify(userBets))
  }, [userBets, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(STORAGE_KEYS.NEXT_ID, JSON.stringify(nextId))
  }, [nextId, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO_BALANCE, JSON.stringify(portfolioBalance))
  }, [portfolioBalance, isHydrated])

  useEffect(() => {
    if (!isHydrated) return
    localStorage.setItem(STORAGE_KEYS.PORTFOLIO_HISTORY, JSON.stringify(portfolioHistory))
  }, [portfolioHistory, isHydrated])

  // Calculate total winnings and total staked
  const totalWinnings = userBets
    .filter(bet => bet.status === 'won' && bet.claimed)
    .reduce((sum, bet) => sum + (bet.payout || 0), 0)

  const totalStaked = userBets
    .filter(bet => bet.status === 'open')
    .reduce((sum, bet) => sum + bet.stake, 0)

  const addMarket = useCallback((
    marketData: Omit<Market, 'id' | 'status' | 'outcomeYes' | 'yesPool' | 'noPool'> & { initialStake: number; platform: Platform }
  ): number => {
    const newId = nextId
    const newMarket: Market = {
      id: newId,
      question: marketData.question,
      postUrl: marketData.postUrl,
      authorHandle: marketData.authorHandle,
      postText: marketData.postText,
      postedAt: marketData.postedAt,
      platform: marketData.platform,
      deadline: marketData.deadline,
      status: 'open',
      outcomeYes: false,
      yesPool: marketData.initialStake,
      noPool: 0,
      creatorAddress: marketData.creatorAddress,
      category: marketData.category,
    }
    
    setMarkets(prev => [newMarket, ...prev])
    setNextId(prev => prev + 1)

    // Also add creator's bet
    const creatorBet: UserBet = {
      marketId: newId,
      question: marketData.question,
      side: 'yes',
      stake: marketData.initialStake,
      status: 'open',
    }
    setUserBets(prev => [creatorBet, ...prev])

    return newId
  }, [nextId])

  const addBet = useCallback((marketId: number, side: 'yes' | 'no', stake: number) => {
    // Update market pools
    setMarkets(prev => prev.map(m => {
      if (m.id === marketId) {
        return {
          ...m,
          yesPool: side === 'yes' ? m.yesPool + stake : m.yesPool,
          noPool: side === 'no' ? m.noPool + stake : m.noPool,
        }
      }
      return m
    }))

    // Add user bet
    const market = markets.find(m => m.id === marketId)
    if (market) {
      const newBet: UserBet = {
        marketId,
        question: market.question,
        side,
        stake,
        status: 'open',
      }
      setUserBets(prev => [newBet, ...prev])

      // Update portfolio balance and history
      setPortfolioBalance(prev => prev - stake)
      setPortfolioHistory(prev => [
        ...prev,
        {
          timestamp: Date.now(),
          balance: portfolioBalance - stake,
          action: 'bet',
          amount: -stake,
          marketId,
        }
      ])
    }
  }, [markets, portfolioBalance])

  const getMarket = useCallback((id: number): Market | undefined => {
    return markets.find(m => m.id === id)
  }, [markets])

  const resolveMarket = useCallback(async (marketId: number, outcomeYes: boolean): Promise<void> => {
    // In production, this would call the smart contract's resolveMarket function
    // For now, we update the local state

    // Find the market
    const market = markets.find(m => m.id === marketId)
    if (!market) {
      throw new Error('Market not found')
    }

    // Update market status
    setMarkets(prev => prev.map(m => {
      if (m.id === marketId) {
        return {
          ...m,
          status: 'resolved' as const,
          outcomeYes,
        }
      }
      return m
    }))

    // Update user bets for this market
    const totalPool = market.yesPool + market.noPool
    const winningPool = outcomeYes ? market.yesPool : market.noPool

    setUserBets(prev => prev.map(bet => {
      if (bet.marketId === marketId && bet.status === 'open') {
        const won = (bet.side === 'yes' && outcomeYes) || (bet.side === 'no' && !outcomeYes)
        const payout = won ? (bet.stake / winningPool) * totalPool : 0

        return {
          ...bet,
          status: won ? 'won' as const : 'lost' as const,
          payout: won ? Math.round(payout * 100) / 100 : 0,
        }
      }
      return bet
    }))
  }, [markets])

  const getUserBetsForMarket = useCallback((marketId: number): UserBet[] => {
    return userBets.filter(bet => bet.marketId === marketId)
  }, [userBets])

  const claimWinnings = useCallback(async (marketId: number): Promise<{ payout: number; claimed: boolean }> => {
    // Find user's winning bet for this market
    const winningBet = userBets.find(
      bet => bet.marketId === marketId && bet.status === 'won' && bet.payout && bet.payout > 0 && !bet.claimed
    )

    if (!winningBet) {
      return { payout: 0, claimed: false }
    }

    const payout = winningBet.payout || 0

    // Update the bet to show it's been claimed
    setUserBets(prev => prev.map(bet => {
      if (bet.marketId === marketId && bet.status === 'won' && !bet.claimed) {
        return {
          ...bet,
          claimed: true,
        }
      }
      return bet
    }))

    // Add winnings to portfolio balance
    const newBalance = portfolioBalance + payout
    setPortfolioBalance(newBalance)

    // Add to portfolio history for chart
    setPortfolioHistory(prev => [
      ...prev,
      {
        timestamp: Date.now(),
        balance: newBalance,
        action: 'claim',
        amount: payout,
        marketId,
      }
    ])

    return { payout, claimed: true }
  }, [userBets, portfolioBalance])

  return (
    <MarketsContext.Provider value={{
      markets,
      userBets,
      portfolioBalance,
      portfolioHistory,
      totalWinnings,
      totalStaked,
      addMarket,
      addBet,
      getMarket,
      resolveMarket,
      claimWinnings,
      getUserBetsForMarket
    }}>
      {children}
    </MarketsContext.Provider>
  )
}

export function useMarkets() {
  const context = useContext(MarketsContext)
  if (!context) {
    throw new Error('useMarkets must be used within a MarketsProvider')
  }
  return context
}


