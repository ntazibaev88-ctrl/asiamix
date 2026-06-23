export type UserRole = "user" | "admin";
export type PlanType = "free" | "vip";
export type GoalCategory =
  | "house"
  | "car"
  | "business"
  | "education"
  | "travel"
  | "family"
  | "health"
  | "other";
export type GoalStatus = "active" | "completed" | "paused" | "cancelled";
export type PaymentStatus = "pending" | "approved" | "rejected";
export type Mood = "great" | "good" | "okay" | "bad" | "terrible";
export type ContentType = "article" | "video" | "book" | "movie";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  plan: PlanType;
  vip_expires_at: string | null;
  referral_code: string;
  referred_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: GoalCategory;
  target_amount: number;
  current_amount: number;
  deadline: string | null;
  status: GoalStatus;
  milestones: Milestone[];
  created_at: string;
  updated_at: string;
}

export interface Milestone {
  id: string;
  title: string;
  target_amount: number;
  completed: boolean;
  completed_at: string | null;
}

export interface SavingsPlan {
  id: string;
  user_id: string;
  name: string;
  goal_amount: number;
  current_amount: number;
  monthly_target: number;
  interest_rate: number;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string | null;
  content: string;
  mood: Mood | null;
  tags: string[];
  entry_date: string;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string | null;
  cover_url: string | null;
  category: string;
  rating: number | null;
  is_premium: boolean;
  buy_url: string | null;
  pdf_url: string | null;
  epub_url: string | null;
  pages: number | null;
  published: boolean;
  xp_reward: number | null;
  created_at: string;
}

export interface Movie {
  id: string;
  title: string;
  director: string | null;
  description: string | null;
  poster_url: string | null;
  banner_url: string | null;
  video_url: string | null;
  trailer_url: string | null;
  category: string;
  year: number | null;
  rating: number | null;
  duration: number | null;
  xp_reward: number | null;
  is_premium: boolean;
  watch_url: string | null;
  published: boolean;
  created_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  cover_url: string | null;
  category: string;
  author_id: string | null;
  is_premium: boolean;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  amount: number;
  months: number;
  bonus_months: number;
  status: PaymentStatus;
  proof_url: string | null;
  kaspi_number: string | null;
  notes: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  created_at: string;
}

export interface DashboardStats {
  total_goals: number;
  active_goals: number;
  completed_goals: number;
  total_savings: number;
  journal_entries: number;
  streak_days: number;
}

export interface AdminStats {
  total_users: number;
  vip_users: number;
  total_revenue: number;
  pending_payments: number;
  total_goals: number;
  total_journal_entries: number;
}
