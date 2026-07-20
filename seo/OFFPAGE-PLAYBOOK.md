# Off-Page SEO Playbook — Denizli Reklam Ajansı

Site içi optimizasyon tamamlandı. **İlk 3 sıra** için aşağıdaki off-site adımlar zorunludur.

## NAP tutarlılığı (her yerde aynı)

| Alan | Değer |
|------|--------|
| İşletme adı | Genua Reklam Ajansı |
| Adres | Yeni, Menderes Blv. No: 7A D:3, 20030 Denizli Merkezefendi/Denizli |
| Telefon | 0551 124 53 06 |
| Web | https://genuadigital.com |
| E-posta | hello@genuadigital.com |

## Hafta 1 — Kritik

### Google Business Profile
- [ ] İşletme oluştur / doğrula
- [ ] Kategori: Reklam Ajansı, Pazarlama Ajansı
- [ ] Web sitesi: `https://genuadigital.com/denizli-reklam-ajansi`
- [ ] 10+ gerçek fotoğraf (ofis, ekip, proje)
- [ ] Hizmet listesi ekle (6 ana hizmet)
- [ ] Haftalık Google gönderisi

### Yorumlar
- [ ] 5–10 gerçek müşteri yorumu (Google)
- [ ] Yanıtlarda marka adı + Denizli geçsin

## Hafta 2–4 — Yerel otorite

### Dizin kayıtları
- [ ] Bing Places
- [ ] Yandex Haritalar
- [ ] Apple Maps (Apple Business Connect)

### Sosyal profil optimizasyonu
- [ ] Instagram bio → `genuadigital.com/denizli-reklam-ajansi`
- [ ] LinkedIn Company → tam NAP + Denizli
- [ ] Behance → Denizli projeleri linkli

## Ay 2–3 — Backlink

### Kolay kazanımlar
- [ ] Müşteri sitelerinde referans / footer linki
- [ ] Tamamlanan projelerin basın duyuruları
- [ ] Denizli etkinlik / sponsorluk sayfaları

### Orta zorluk
- [ ] Yerel haber siteleri (proje haberi)
- [ ] Sektörel blog misafir yazısı
- [ ] Ticaret odası / STK üye dizinleri

### Kaçınılacaklar
- Satın alınmış spam backlink paketleri
- Alakasız dizin siteleri
- Anchor text'in %100 "denizli reklam ajansı" olması (doğal karışım kullanın)

## İçerik takvimi (aylık)

| Ay | Konu | Hedef kelime |
|----|------|--------------|
| 1 | Denizli'de Google Ads yönetimi | google ads denizli |
| 2 | Kurumsal sosyal medya Denizli | sosyal medya ajansı denizli |
| 3 | Denizli web tasarım rehberi | web tasarım denizli |

Statik blog şablonu: `blog-denizli-reklam-ajansi.html` — yeni yazılar için aynı yapıyı kopyalayın.

## KPI takibi

| Metrik | Araç | Hedef (3 ay) |
|--------|------|--------------|
| Organik tıklama | Search Console | +40% |
| "denizli reklam ajansı" konumu | Search Console | Top 10 |
| Google Maps görüntüleme | GBP Insights | 500+/ay |
| Domain referring domains | Ahrefs / Ubersuggest | +10 kaliteli |

## Teknik hatırlatma

Her içerik güncellemesinden sonra:

```bash
node scripts/run-seo.mjs
git add . && git commit -m "..." && git push
```

Vercel deploy sonrası Search Console'da sitemap'i yeniden gönderin.
