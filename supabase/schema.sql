-- Coast Media Group Database Schema
-- Run this in your Supabase SQL Editor

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL DEFAULT '',
  excerpt TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'news',
  author TEXT NOT NULL DEFAULT 'Coast Editorial',
  image_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('published', 'draft', 'review')),
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category);
CREATE INDEX idx_articles_featured ON articles(featured);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_created_at ON articles(created_at DESC);

-- Schedule table
CREATE TABLE IF NOT EXISTS schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_name TEXT NOT NULL,
  host TEXT NOT NULL,
  day_of_week TEXT NOT NULL DEFAULT 'Monday',
  start_time TEXT NOT NULL,
  end_time TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reports (story submissions) table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT '',
  email TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  anonymous BOOLEAN NOT NULL DEFAULT false,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'published', 'rejected')),
  location TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_created_at ON reports(created_at DESC);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stream_url TEXT NOT NULL DEFAULT 'https://radio.thecoast.co.ke/stream',
  youtube_channel_id TEXT,
  site_name TEXT NOT NULL DEFAULT 'The Coast Media Group',
  tagline TEXT NOT NULL DEFAULT "Kenya's Coastal Voice",
  contact_email TEXT NOT NULL DEFAULT 'support@wedialai.com',
  phone TEXT NOT NULL DEFAULT '+254 106 216 699',
  address TEXT NOT NULL DEFAULT 'Mombasa, Kenya',
  social_links JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- App users table (for role-based access, synced from Clerk)
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'contributor' CHECK (role IN ('admin', 'editor', 'contributor')),
  allowed_areas TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Brief items (breaking news ticker)
CREATE TABLE IF NOT EXISTS brief_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  article_id UUID REFERENCES articles(id) ON DELETE SET NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE brief_items ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Articles are viewable by everyone" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Schedule is viewable by everyone" ON schedule FOR SELECT USING (true);
CREATE POLICY "Settings are viewable by everyone" ON settings FOR SELECT USING (true);
CREATE POLICY "Brief items are viewable by everyone" ON brief_items FOR SELECT USING (true);

-- Admin write policies (these will be enforced via API routes with service role)
CREATE POLICY "Reports can be created by anyone" ON reports FOR INSERT WITH CHECK (true);

-- Insert default settings
INSERT INTO settings (id, stream_url, youtube_channel_id, site_name, tagline, contact_email, phone, address, social_links)
VALUES (
  gen_random_uuid(),
  'https://radio.thecoast.co.ke/stream',
  null,
  'The Coast Media Group',
  'Kenya\'s Coastal Voice',
  'support@wedialai.com',
  '+254 106 216 699',
  'Mombasa, Kenya',
  '{"twitter": "https://x.com/CoastNewspaper", "whatsapp": "https://wa.me/254106216699"}'::jsonb
)
ON CONFLICT DO NOTHING;

-- Insert sample articles
INSERT INTO articles (title, slug, content, excerpt, category, author, image_url, featured, status, views)
VALUES
  ('Mombasa Port Achieves Record-Breaking Cargo Throughput, Cementing Status as East Africa\'s Maritime Hub', 'mombasa-port-record-throughput', 'Full article content here...', 'The port handled over 35 million tonnes in the first half of 2026...', 'news', 'Coast Editorial', 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?w=1200&h=600&fit=crop', true, 'published', 5234),
  ('Coast universities rank top in national innovation index', 'coast-universities-innovation-index', 'Full article content here...', 'Technical University of Mombasa and Pwani University lead in research output...', 'education', 'Sarah Kimani', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop', false, 'published', 1189),
  ('Export processing zones create 5,000 new jobs at the coast', 'export-zones-5000-jobs', 'Full article content here...', 'New EPZ licenses issued for textile and agro-processing factories...', 'business', 'Amina Hassan', 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=400&h=300&fit=crop', false, 'published', 890),
  ('Bandari FC signs three international players for new season', 'bandari-fc-signs-players', 'Full article content here...', 'The Mombasa-based club strengthens squad with players from Tanzania...', 'sports', 'David Ochieng', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=300&fit=crop', false, 'published', 3456),
  ('Swahili cuisine festival returns to Mombasa with 50+ vendors', 'swahili-cuisine-festival-2026', 'Full article content here...', 'Annual celebration of coastal culinary heritage attracts chefs...', 'lifestyle', 'Fatima Ali', 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop', false, 'published', 1876),
  ('Coast General Hospital opens state-of-the-art cardiac unit', 'coast-general-cardiac-unit', 'Full article content here...', 'New catheterization lab brings advanced heart care to the coastal region...', 'health', 'Coast Editorial', 'https://images.unsplash.com/photo-1461896836934-voices-5e14a32f?w=400&h=300&fit=crop', false, 'published', 2100),
  ('Editorial: Why coastal counties must prioritise blue economy', 'editorial-blue-economy', 'Full article content here...', 'The untapped potential of our oceans could transform the economic landscape...', 'opinion', 'Coast Editorial', 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=400&h=300&fit=crop', false, 'published', 756),
  ('East African Community summit addresses regional trade barriers', 'eac-summit-trade-barriers', 'Full article content here...', 'Heads of state agree on new framework to eliminate non-tariff barriers...', 'international', 'Coast Editorial', 'https://images.unsplash.com/photo-1526666923127-b2970f64b422?w=400&h=300&fit=crop', false, 'published', 1500),
  ('County governments launch joint coastal security operation', 'coastal-security-operation', 'Full article content here...', 'Multi-agency team deployed to enhance safety along beaches and tourist corridors...', 'news', 'Coast Editorial', 'https://images.unsplash.com/photo-1569025743873-ea3a9e3c6756?w=400&h=300&fit=crop', false, 'published', 2300)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample brief items
INSERT INTO brief_items (content, order_index)
VALUES
  ('President Ruto announces new coastal development fund for Mombasa and Kilifi counties', 1),
  ('Radio Coast launches new morning show "Fichua Wazi" with expanded coverage', 2),
  ('Mombasa Port records highest cargo throughput in five years', 3),
  ('Kilifi tourism sector sees 40% growth as international visitors return', 4),
  ('Coast Media Group wins regional journalism excellence award 2026', 5)
ON CONFLICT DO NOTHING;

-- Insert sample schedule
INSERT INTO schedule (show_name, host, day_of_week, start_time, end_time, description)
VALUES
  ('Morning Drive', 'DJ Kipawa', 'Monday', '06:00', '10:00', 'News, traffic updates, and coastal conversations to start your day'),
  ('Coast Talk', 'Amina Hassan', 'Monday', '10:00', '13:00', 'Political analysis, social issues, and community dialogue'),
  ('The Vibe', 'Mike Juma', 'Monday', '13:00', '16:00', 'Music, entertainment news, and celebrity interviews'),
  ('Evening Reflections', 'Sarah Ochieng', 'Monday', '16:00', '19:00', 'News roundup, cultural features, and thought-provoking discussions'),
  ('Night Coast', 'Auto DJ', 'Monday', '19:00', '06:00', 'Overnight music and news updates every hour')
ON CONFLICT DO NOTHING;
