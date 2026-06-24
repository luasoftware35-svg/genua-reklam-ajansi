export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

type RowBase = Record<string, Json | string[] | null | undefined>;
type TableDef<Row extends RowBase> = {
  Row: Row;
  Insert: Partial<Row>;
  Update: Partial<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      site_settings: TableDef<{ id: string; site_title: string; site_description: string | null; site_keywords: string | null; logo_url: string | null; favicon_url: string | null; contact_email: string | null; contact_phone: string | null; contact_address: string | null; contact_map_embed: string | null; social_instagram: string | null; social_facebook: string | null; social_twitter: string | null; social_linkedin: string | null; social_youtube: string | null; social_tiktok: string | null; social_behance: string | null; hero_title: string | null; hero_subtitle: string | null; hero_cta_primary_text: string | null; hero_cta_primary_url: string | null; hero_cta_secondary_text: string | null; hero_cta_secondary_url: string | null; hero_bg_video_url: string | null; stats_counters: Json; footer_description: string | null; footer_copyright: string | null; google_analytics_id: string | null; google_tag_manager_id: string | null; meta_og_image_url: string | null; updated_at: string | null }>;
      services: TableDef<{ id: string; slug: string; title: string; short_description: string | null; long_description: string | null; icon: string | null; cover_image_url: string | null; what_we_do: Json; tools_used: Json; meta_title: string | null; meta_description: string | null; display_order: number | null; is_active: boolean | null; is_featured: boolean | null; created_at: string | null; updated_at: string | null }>;
      projects: TableDef<{ id: string; slug: string; title: string; client_name: string | null; category: string | null; tags: string[] | null; cover_image_url: string | null; gallery_images: Json; short_description: string | null; challenge: string | null; strategy: string | null; execution: string | null; result: string | null; metrics: Json; tools_used: string[] | null; project_date: string | null; project_url: string | null; meta_title: string | null; meta_description: string | null; display_order: number | null; is_active: boolean | null; is_featured: boolean | null; created_at: string | null; updated_at: string | null }>;
      team_members: TableDef<{ id: string; full_name: string; title: string; bio: string | null; resume_content: string | null; photo_url: string | null; social_linkedin: string | null; social_instagram: string | null; social_twitter: string | null; email: string | null; display_order: number | null; is_active: boolean | null; created_at: string | null; updated_at: string | null }>;
      testimonials: TableDef<{ id: string; client_name: string; client_title: string | null; client_company: string | null; client_photo_url: string | null; client_company_logo_url: string | null; testimonial_text: string; rating: number | null; project_id: string | null; display_order: number | null; is_active: boolean | null; is_featured: boolean | null; created_at: string | null; updated_at: string | null }>;
      blog_posts: TableDef<{ id: string; slug: string; title: string; excerpt: string | null; content: string | null; cover_image_url: string | null; author_name: string | null; author_photo_url: string | null; author_title: string | null; category: string | null; tags: string[] | null; meta_title: string | null; meta_description: string | null; read_time_minutes: number | null; status: string | null; published_at: string | null; display_order: number | null; is_featured: boolean | null; view_count: number | null; created_at: string | null; updated_at: string | null }>;
      contact_messages: TableDef<{ id: string; full_name: string; email: string; phone: string | null; subject: string | null; message: string; form_type: string | null; requested_services: string[] | null; budget_range: string | null; timeline: string | null; company_name: string | null; company_website: string | null; status: string | null; admin_notes: string | null; replied_at: string | null; ip_address: string | null; user_agent: string | null; referrer_page: string | null; created_at: string | null; updated_at: string | null }>;
      client_logos: TableDef<{ id: string; company_name: string; logo_url: string | null; initials: string | null; website_url: string | null; display_order: number | null; is_public_client: boolean | null; is_collapsed: boolean | null; is_active: boolean | null; created_at: string | null }>;
      banners: TableDef<{ id: string; title: string; subtitle: string | null; button_text: string | null; button_url: string | null; image_url: string | null; bg_color: string | null; text_color: string | null; display_order: number | null; is_active: boolean | null; starts_at: string | null; ends_at: string | null; created_at: string | null }>;
      admin_users: TableDef<{ id: string; full_name: string; email: string; role: string | null; photo_url: string | null; is_active: boolean | null; last_login: string | null; created_at: string | null }>;
      activity_logs: TableDef<{ id: string; admin_id: string | null; action: string; table_name: string | null; record_id: string | null; changes: Json; ip_address: string | null; created_at: string | null }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
