export type FieldType = 'text' | 'textarea' | 'richtext' | 'number' | 'checkbox' | 'select' | 'date' | 'datetime' | 'image' | 'json' | 'tags' | 'email' | 'url' | 'color';

export type ResourceField = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  full?: boolean;
  options?: string[];
  placeholder?: string;
  readOnly?: boolean;
};

export type ResourceConfig = {
  key: string;
  title: string;
  description: string;
  table: string;
  orderBy?: string;
  single?: boolean;
  createLabel?: string;
  fields: ResourceField[];
  columns: string[];
};

const commonSeo: ResourceField[] = [
  { name: 'meta_title', label: 'Meta Başlık', type: 'text' },
  { name: 'meta_description', label: 'Meta Açıklama', type: 'textarea', full: true },
];

export const resources: Record<string, ResourceConfig> = {
  ayarlar: {
    key: 'ayarlar', title: 'Site Ayarları', description: 'Genel site bilgileri, iletişim, sosyal medya ve hero alanı.', table: 'site_settings', single: true,
    fields: [
      { name: 'site_title', label: 'Site Başlığı', type: 'text', required: true },
      { name: 'site_description', label: 'Site Açıklaması', type: 'textarea', full: true },
      { name: 'site_keywords', label: 'SEO Anahtar Kelimeler', type: 'text' },
      { name: 'logo_url', label: 'Logo URL', type: 'image' },
      { name: 'favicon_url', label: 'Favicon URL', type: 'image' },
      { name: 'contact_email', label: 'İletişim Email', type: 'email' },
      { name: 'contact_phone', label: 'Telefon', type: 'text' },
      { name: 'contact_address', label: 'Adres', type: 'textarea', full: true },
      { name: 'social_instagram', label: 'Instagram', type: 'url' },
      { name: 'social_linkedin', label: 'LinkedIn', type: 'url' },
      { name: 'social_behance', label: 'Behance', type: 'url' },
      { name: 'hero_title', label: 'Hero Başlığı', type: 'text' },
      { name: 'hero_subtitle', label: 'Hero Alt Metni', type: 'textarea', full: true },
      { name: 'hero_cta_primary_text', label: 'Birincil CTA Metni', type: 'text' },
      { name: 'hero_cta_primary_url', label: 'Birincil CTA URL', type: 'text' },
      { name: 'hero_cta_secondary_text', label: 'İkincil CTA Metni', type: 'text' },
      { name: 'hero_cta_secondary_url', label: 'İkincil CTA URL', type: 'text' },
      { name: 'portfolio_hero_eyebrow', label: 'Portföy Üst Başlık', type: 'text' },
      { name: 'portfolio_hero_title', label: 'Portföy Başlığı', type: 'text', full: true },
      { name: 'portfolio_hero_description', label: 'Portföy Açıklaması', type: 'textarea', full: true },
      { name: 'team_spotify_eyebrow', label: 'Spotify Üst Başlık', type: 'text' },
      { name: 'team_spotify_title', label: 'Spotify Başlığı', type: 'text' },
      { name: 'team_spotify_description', label: 'Spotify Açıklaması', type: 'textarea', full: true },
      { name: 'team_spotify_url', label: 'Spotify Playlist URL', type: 'url', placeholder: 'https://open.spotify.com/playlist/...' },
      { name: 'team_spotify_cover_url', label: 'Playlist Kapak Görseli', type: 'image' },
      { name: 'stats_counters', label: 'Sayaçlar JSON', type: 'json', full: true },
      { name: 'footer_description', label: 'Footer Açıklaması', type: 'textarea', full: true },
      { name: 'footer_copyright', label: 'Telif Metni', type: 'text', full: true },
    ], columns: ['site_title', 'contact_email', 'contact_phone', 'updated_at'],
  },
  hizmetler: {
    key: 'hizmetler', title: 'Hizmetler', description: 'Ajans hizmetlerini, SEO metinlerini ve sıralamayı yönetin.', table: 'services', orderBy: 'display_order', createLabel: 'Yeni Hizmet',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'short_description', label: 'Kısa Açıklama', type: 'textarea', full: true }, { name: 'long_description', label: 'Uzun Açıklama', type: 'richtext', full: true },
      { name: 'icon', label: 'Lucide Icon', type: 'text' }, { name: 'cover_image_url', label: 'Kapak Görseli', type: 'image' },
      { name: 'what_we_do', label: 'Yapılanlar JSON', type: 'json', full: true }, { name: 'tools_used', label: 'Araçlar JSON', type: 'json', full: true },
      { name: 'display_order', label: 'Sıra', type: 'number' }, { name: 'is_active', label: 'Aktif', type: 'checkbox' }, { name: 'is_featured', label: 'Öne Çıkan', type: 'checkbox' }, ...commonSeo,
    ], columns: ['title', 'slug', 'display_order', 'is_active', 'is_featured'],
  },
  projeler: {
    key: 'projeler', title: 'Portföy', description: 'Portföy kartları, vaka analizi detayları, metrikler ve galeri görselleri.', table: 'projects', orderBy: 'display_order', createLabel: 'Yeni Portföy Projesi',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true },
      { name: 'client_name', label: 'Müşteri', type: 'text' }, { name: 'category', label: 'Kategori (kart etiketi)', type: 'text' },
      { name: 'tags', label: 'Filtre Etiketleri', type: 'tags', placeholder: 'dijital, sosyal, marka, web' },
      { name: 'cover_image_url', label: 'Kapak Görseli', type: 'image' },
      { name: 'gallery_images', label: 'Galeri Görselleri (JSON dizi)', type: 'json', full: true, placeholder: '["https://.../1.jpg","https://.../2.jpg"]' },
      { name: 'short_description', label: 'Kısa Açıklama (modal / kart)', type: 'textarea', full: true },
      { name: 'case_hero_title', label: 'Vaka Analizi Başlığı', type: 'text', full: true },
      { name: 'case_hero_lead', label: 'Vaka Analizi Giriş Metni', type: 'textarea', full: true },
      { name: 'challenge', label: 'Problem (vaka analizi)', type: 'textarea', full: true },
      { name: 'strategy', label: 'Strateji (vaka analizi)', type: 'textarea', full: true },
      { name: 'execution', label: 'Uygulama (vaka analizi)', type: 'textarea', full: true },
      { name: 'result', label: 'Sonuç (vaka analizi)', type: 'textarea', full: true },
      { name: 'metrics', label: 'Metrikler JSON', type: 'json', full: true, placeholder: '[{"value":320,"prefix":"%","label":"Daha fazla erişim","duration":1700}]' },
      { name: 'tools_used', label: 'Kullanılan Araçlar', type: 'tags' }, { name: 'project_date', label: 'Proje Tarihi', type: 'date' }, { name: 'project_url', label: 'Harici Proje URL', type: 'url' },
      { name: 'display_order', label: 'Sıra', type: 'number' }, { name: 'is_active', label: 'Aktif', type: 'checkbox' }, { name: 'is_featured', label: 'Öne Çıkan', type: 'checkbox' }, ...commonSeo,
    ], columns: ['title', 'client_name', 'category', 'display_order', 'is_active'],
  },
  ekip: {
    key: 'ekip', title: 'Ekip', description: 'Ekip üyeleri, görevleri ve sosyal bağlantıları.', table: 'team_members', orderBy: 'display_order', createLabel: 'Yeni Üye',
    fields: [
      { name: 'full_name', label: 'Ad Soyad', type: 'text', required: true }, { name: 'title', label: 'Ünvan', type: 'text', required: true }, { name: 'bio', label: 'Bio', type: 'textarea', full: true },
      { name: 'photo_url', label: 'Fotoğraf', type: 'image' }, { name: 'email', label: 'Email', type: 'email' }, { name: 'social_linkedin', label: 'LinkedIn', type: 'url' }, { name: 'social_instagram', label: 'Instagram', type: 'url' }, { name: 'social_twitter', label: 'Twitter/X', type: 'url' },
      { name: 'display_order', label: 'Sıra', type: 'number' }, { name: 'is_active', label: 'Aktif', type: 'checkbox' },
    ], columns: ['full_name', 'title', 'display_order', 'is_active'],
  },
  testimonials: {
    key: 'testimonials', title: 'Müşteri Görüşleri', description: 'Referans yorumları ve puanları.', table: 'testimonials', orderBy: 'display_order', createLabel: 'Yeni Görüş',
    fields: [
      { name: 'client_name', label: 'Müşteri Adı', type: 'text', required: true }, { name: 'client_title', label: 'Ünvan', type: 'text' }, { name: 'client_company', label: 'Firma', type: 'text' },
      { name: 'client_photo_url', label: 'Fotoğraf', type: 'image' }, { name: 'client_company_logo_url', label: 'Firma Logosu', type: 'image' },
      { name: 'testimonial_text', label: 'Yorum', type: 'textarea', required: true, full: true }, { name: 'rating', label: 'Puan', type: 'number' }, { name: 'display_order', label: 'Sıra', type: 'number' }, { name: 'is_active', label: 'Aktif', type: 'checkbox' }, { name: 'is_featured', label: 'Öne Çıkan', type: 'checkbox' },
    ], columns: ['client_name', 'client_company', 'rating', 'display_order', 'is_active'],
  },
  blog: {
    key: 'blog', title: 'Blog', description: 'Yazılar, yayın durumu, etiketler ve SEO alanları.', table: 'blog_posts', orderBy: 'display_order', createLabel: 'Yeni Yazı',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', required: true }, { name: 'slug', label: 'Slug', type: 'text', required: true }, { name: 'excerpt', label: 'Özet', type: 'textarea', full: true }, { name: 'content', label: 'İçerik', type: 'richtext', full: true },
      { name: 'cover_image_url', label: 'Kapak Görseli', type: 'image' }, { name: 'author_name', label: 'Yazar', type: 'text' }, { name: 'author_photo_url', label: 'Yazar Fotoğrafı', type: 'image' }, { name: 'author_title', label: 'Yazar Ünvanı', type: 'text' },
      { name: 'category', label: 'Kategori', type: 'text' }, { name: 'tags', label: 'Etiketler', type: 'tags' }, { name: 'status', label: 'Durum', type: 'select', options: ['draft', 'published', 'archived'] }, { name: 'published_at', label: 'Yayın Tarihi', type: 'datetime' },
      { name: 'display_order', label: 'Sıra', type: 'number' }, { name: 'is_featured', label: 'Öne Çıkan', type: 'checkbox' }, ...commonSeo,
    ], columns: ['title', 'category', 'status', 'published_at', 'is_featured'],
  },
  mesajlar: {
    key: 'mesajlar', title: 'Mesajlar', description: 'İletişim ve teklif formu başvuruları.', table: 'contact_messages', orderBy: 'created_at', createLabel: 'Yeni Mesaj',
    fields: [
      { name: 'full_name', label: 'Ad Soyad', type: 'text', required: true }, { name: 'email', label: 'Email', type: 'email', required: true }, { name: 'phone', label: 'Telefon', type: 'text' }, { name: 'subject', label: 'Konu', type: 'text' },
      { name: 'message', label: 'Mesaj', type: 'textarea', full: true, required: true }, { name: 'form_type', label: 'Form Tipi', type: 'select', options: ['contact', 'quote'] }, { name: 'requested_services', label: 'İstenen Hizmetler', type: 'tags' },
      { name: 'budget_range', label: 'Bütçe', type: 'text' }, { name: 'timeline', label: 'Zamanlama', type: 'text' }, { name: 'company_name', label: 'Firma', type: 'text' }, { name: 'company_website', label: 'Web Sitesi', type: 'url' },
      { name: 'status', label: 'Durum', type: 'select', options: ['new', 'read', 'replied', 'archived'] }, { name: 'admin_notes', label: 'Admin Notu', type: 'textarea', full: true },
    ], columns: ['full_name', 'email', 'phone', 'status', 'created_at'],
  },
  musteriler: {
    key: 'musteriler', title: 'Müşteri Logoları', description: 'Projelerimiz sayfasındaki referans markaları, kamu kurumları ve logo sıralaması.', table: 'client_logos', orderBy: 'display_order', createLabel: 'Yeni Logo',
    fields: [
      { name: 'company_name', label: 'Firma Adı', type: 'text', required: true },
      { name: 'logo_url', label: 'Logo Görseli', type: 'image' },
      { name: 'initials', label: 'Kısaltma (logo yoksa)', type: 'text', placeholder: 'Örn: TG, AB' },
      { name: 'website_url', label: 'Web Sitesi', type: 'url' },
      { name: 'display_order', label: 'Sıra', type: 'number' },
      { name: 'is_public_client', label: 'Kamu / Kurumsal Vurgu', type: 'checkbox' },
      { name: 'is_collapsed', label: 'Daha Fazla Göster Altında', type: 'checkbox' },
      { name: 'is_active', label: 'Aktif', type: 'checkbox' },
    ], columns: ['company_name', 'logo_url', 'initials', 'display_order', 'is_public_client', 'is_collapsed', 'is_active'],
  },
  bannerlar: {
    key: 'bannerlar', title: 'Bannerlar', description: 'Kampanya ve duyuru bannerları.', table: 'banners', orderBy: 'display_order', createLabel: 'Yeni Banner',
    fields: [
      { name: 'title', label: 'Başlık', type: 'text', required: true }, { name: 'subtitle', label: 'Alt Başlık', type: 'textarea', full: true }, { name: 'button_text', label: 'Buton Metni', type: 'text' }, { name: 'button_url', label: 'Buton URL', type: 'text' },
      { name: 'image_url', label: 'Görsel', type: 'image' }, { name: 'bg_color', label: 'Arka Plan', type: 'color' }, { name: 'text_color', label: 'Yazı Rengi', type: 'color' }, { name: 'display_order', label: 'Sıra', type: 'number' }, { name: 'is_active', label: 'Aktif', type: 'checkbox' },
      { name: 'starts_at', label: 'Başlangıç', type: 'datetime' }, { name: 'ends_at', label: 'Bitiş', type: 'datetime' },
    ], columns: ['title', 'display_order', 'is_active', 'starts_at', 'ends_at'],
  },
};

export function getResourceConfig(key: string) {
  return resources[key];
}

export const resourceLinks = Object.values(resources);
