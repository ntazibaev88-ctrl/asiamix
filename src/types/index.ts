export type Lang = 'kk' | 'ru' | 'en'
export type Theme = 'light' | 'dark' | 'system'

export interface User {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  plan: 'free' | 'premium'
  lang: Lang
  theme: Theme
  created_at: string
}

export interface DiaryEntry {
  id: string
  user_id: string
  title: string
  content: string
  mood: 1 | 2 | 3 | 4 | 5
  tags: string[]
  date: string
  created_at: string
  updated_at: string
}

export type GoalCategory =
  | 'house'
  | 'car'
  | 'business'
  | 'education'
  | 'travel'
  | 'family'
  | 'health'
  | 'other'

export interface Goal {
  id: string
  user_id: string
  title: string
  description?: string
  category: GoalCategory
  target_date?: string
  progress: number
  completed: boolean
  milestones: Milestone[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface Milestone {
  id: string
  goal_id: string
  title: string
  completed: boolean
  due_date?: string
}

export type HabitFrequency = 'daily' | 'weekly' | 'monthly'

export interface Habit {
  id: string
  user_id: string
  title: string
  description?: string
  frequency: HabitFrequency
  streak: number
  best_streak: number
  color: string
  icon: string
  completions: HabitCompletion[]
  created_at: string
}

export interface HabitCompletion {
  id: string
  habit_id: string
  date: string
  completed: boolean
}

export type TransactionType = 'income' | 'expense' | 'savings'

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  category: string
  amount: number
  note?: string
  date: string
  created_at: string
}

export interface FinancialGoal {
  id: string
  user_id: string
  title: string
  target_amount: number
  current_amount: number
  deadline?: string
  created_at: string
}

export interface VisionBoardItem {
  id: string
  user_id: string
  image_url: string
  title?: string
  description?: string
  category?: string
  position_x: number
  position_y: number
  created_at: string
}

export type ArticleCategory =
  | 'investment'
  | 'gold'
  | 'silver'
  | 'bonds'
  | 'literacy'
  | 'business'
  | 'motivation'

export interface Article {
  id: string
  title_kk: string
  title_ru: string
  title_en: string
  content_kk: string
  content_ru: string
  content_en: string
  category: ArticleCategory
  cover_url?: string
  published: boolean
  author_id: string
  created_at: string
}

export interface DashboardStats {
  diary_count: number
  goals_count: number
  goals_completed: number
  habits_active: number
  current_streak: number
  finance_balance: number
}
