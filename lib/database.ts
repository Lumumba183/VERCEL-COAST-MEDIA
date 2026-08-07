export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: string;
          excerpt: string;
          category: string;
          author: string;
          image_url: string | null;
          featured: boolean;
          status: string;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['articles']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['articles']['Insert']>;
      };
      schedule: {
        Row: {
          id: string;
          show_name: string;
          host: string;
          day_of_week: string;
          start_time: string;
          end_time: string;
          description: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['schedule']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['schedule']['Insert']>;
      };
      reports: {
        Row: {
          id: string;
          name: string;
          email: string;
          title: string;
          message: string;
          anonymous: boolean;
          status: string;
          location: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['reports']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['reports']['Insert']>;
      };
      settings: {
        Row: {
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
        };
        Insert: Omit<Database['public']['Tables']['settings']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['settings']['Insert']>;
      };
      app_users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          role: string;
          allowed_areas: string[];
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['app_users']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['app_users']['Insert']>;
      };
      brief_items: {
        Row: {
          id: string;
          content: string;
          article_id: string | null;
          order_index: number;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['brief_items']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['brief_items']['Insert']>;
      };
    };
  };
}
