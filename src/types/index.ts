export type Role = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  role: Role
  two_factor_enabled: boolean
  created_at: string
  updated_at: string
}

export interface DiaryEntry {
  id: string
  user_id: string
  title: string
  content: string
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible' | null
  is_locked: boolean
  pin_hash: string | null
  created_at: string
  updated_at: string
}

export type GoalCategory =
  | 'House'
  | 'Car'
  | 'Business'
  | 'Travel'
  | 'Education'
  | 'Family'
  | 'Health'
  | 'Other'

export interface Goal {
  id: string
  user_id: string
  title: string
  description: string | null
  category: GoalCategory
  target_amount: number | null
  current_amount: number
  target_date: string | null
  is_completed: boolean
  created_at: string
  updated_at: string
}

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  amount: number
  category: string
  description: string
  date: string
  created_at: string
}

export interface SavingsGoal {
  id: string
  user_id: string
  title: string
  target_amount: number
  current_amount: number
  target_date: string | null
  color: string
  created_at: string
  updated_at: string
}

export interface Budget {
  id: string
  user_id: string
  category: string
  monthly_limit: number
  month: string
  created_at: string
}

export type ArticleCategory =
  | 'Investing'
  | 'Bonds'
  | 'Gold'
  | 'Silver'
  | 'Savings'
  | 'Business'
  | 'Crypto'
  | 'Real Estate'

export interface Article {
  id: string
  author_id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: ArticleCategory
  cover_image: string | null
  is_published: boolean
  published_at: string | null
  read_time: number
  created_at: string
  updated_at: string
  author?: Profile
  is_bookmarked?: boolean
}

export interface Bookmark {
  id: string
  user_id: string
  article_id: string
  created_at: string
}
