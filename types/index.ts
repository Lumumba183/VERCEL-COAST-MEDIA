export type ArticleCategory =
  | 'National News'
  | 'County News'
  | 'World News'
  | 'Politics'
  | 'Sports'
  | 'Health'
  | 'Celebrity'
  | 'Swahili'
  | 'Community'
  | 'Opinion';

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: ArticleCategory;
  image_url: string | null;
  author: string;
  featured: boolean;
  published: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleItem {
  id: string;
  day: string;
  start_time: string;
  end_time: string;
  show_name: string;
  host: string;
  description: string;
  created_at: string;
}

export interface Report {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  location: string | null;
  message: string;
  status: 'new' | 'reviewed' | 'resolved';
  created_at: string;
}

export interface Setting {
  key: string;
  value: string;
  updated_at: string;
}

export interface AppUser {
  id: string; // Clerk user id
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'user';
  allowed_areas: string[];
  created_at: string;
}

export interface BriefItem {
  id: string;
  text: string;
  article_id: string | null;
  position: number;
  active: boolean;
  created_at: string;
}

export const ARTICLE_CATEGORIES: ArticleCategory[] = [
  'National News',
  'County News',
  'World News',
  'Politics',
  'Sports',
  'Health',
  'Celebrity',
  'Swahili',
  'Community',
  'Opinion',
];

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export const ADMIN_AREAS = ['articles', 'schedule', 'reports', 'users', 'brief', 'settings', 'all'];

export type AdPlacement = 'leaderboard' | 'sidebar' | 'article-bottom';

export interface Advert {
  id: string;
  title: string;
  client_name: string;
  client_contact: string | null;
  image_url: string;
  link_url: string | null;
  placement: AdPlacement;
  start_date: string;   // ISO date (yyyy-mm-dd)
  end_date: string;     // ISO date — advert auto-hides after this
  active: boolean;
  notes: string | null;
  created_at: string;
}
