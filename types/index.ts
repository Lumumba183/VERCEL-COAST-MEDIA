export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  category: string;
  author: string;
  image_url: string | null;
  featured: boolean;
  status: 'published' | 'draft' | 'review';
  views: number;
  created_at: string;
  updated_at: string;
}

export interface ScheduleItem {
  id: string;
  show_name: string;
  host: string;
  day_of_week: string;
  start_time: string;
  end_time: string;
  description: string | null;
  created_at: string;
}

export interface Report {
  id: string;
  name: string;
  email: string;
  title: string;
  message: string;
  anonymous: boolean;
  status: 'pending' | 'reviewed' | 'published' | 'rejected';
  location: string | null;
  created_at: string;
}

export interface SiteSettings {
  id: string;
  stream_url: string;
  youtube_channel_id: string | null;
  site_name: string;
  tagline: string;
  contact_email: string;
  phone: string;
  address: string;
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface AppUser {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'editor' | 'contributor';
  allowed_areas: string[];
  created_at: string;
}

export interface BriefItem {
  id: string;
  content: string;
  article_id: string | null;
  order_index: number;
  created_at: string;
}

export interface TrendingStory {
  num: number;
  title: string;
  timeAgo: string;
  slug: string;
}

export interface WeatherCity {
  name: string;
  temp: string;
  condition: string;
  icon: string;
}

export interface TvVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: string;
  views: string;
  date: string;
  category: string;
}

export interface EpaperEdition {
  id: string;
  title: string;
  date: string;
  pages: number;
  type: string;
}
