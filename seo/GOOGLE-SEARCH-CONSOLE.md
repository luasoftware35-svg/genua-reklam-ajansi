# Google Search Console Kurulumu — Genua

Site: `https://genuadigital.com`

## 1. Mülk ekleme

1. [Google Search Console](https://search.google.com/search-console) → **Mülk Ekle**
2. **URL öneki** seçin: `https://genuadigital.com`
3. Doğrulama yöntemi (önerilen): **HTML etiketi** veya **DNS TXT kaydı** (Vercel/domain sağlayıcı)

## 2. Sitemap gönderimi

Search Console → **Dizin oluşturma** → **Site Haritaları**

```
https://genuadigital.com/sitemap.xml
```

Deploy sonrası bu URL'nin 200 döndüğünü doğrulayın.

## 3. URL Denetimi (öncelikli sayfalar)

Her deploy sonrası şu URL'leri **Canlı URL'yi test et** ile kontrol edin:

| Sayfa | Canonical URL |
|-------|---------------|
| Ana sayfa | `/anasayfa` |
| Yerel landing | `/denizli-reklam-ajansi` |
| Hizmetler | `/hizmetler` |
| İletişim | `/iletisim` |
| Blog (yerel) | `/blog-denizli-reklam-ajansi` |

## 4. Performans izleme

**Performans** raporunda filtre:

- Sorgu: `denizli reklam ajansı`
- Sorgu: `denizli dijital ajans`
- Sorgu: `reklam ajansı denizli`

Haftalık: tıklama, gösterim, ortalama konum, CTR.

## 5. Core Web Vitals

**Deneyim** → **Core Web Vitals** — mobil ve masaüstü LCP/INP/CLS takibi.

## 6. Schema doğrulama

[Rich Results Test](https://search.google.com/test/rich-results) ile kontrol:

- Ana sayfa → `LocalBusiness`, `WebSite`, `BreadcrumbList`
- `/denizli-reklam-ajansi` → `FAQPage`, `LocalBusiness`
- `/iletisim` → `ContactPage`, `LocalBusiness`

## 7. Deploy sonrası SEO pipeline

```bash
node scripts/run-seo.mjs
```

Bu komut meta/schema günceller, footer linklerini senkronlar ve sitemap üretir.

## 8. Beklenen index süresi

- Yeni sayfalar: 3–14 gün
- Sorgu konumu değişimi: 4–12 hafta (off-page sinyallere bağlı)
