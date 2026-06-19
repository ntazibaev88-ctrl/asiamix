export type UserRole = 'user' | 'admin';
export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  lesson_count: number;
  image_url: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  order_index: number;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  screenshot_url: string | null;
  note: string | null;
  status: PaymentStatus;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
  courses?: Course;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
  courses?: Course;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  created_at: string;
}

export interface Certificate {
  id: string;
  user_id: string;
  course_id: string;
  issued_at: string;
  courses?: Course;
}
