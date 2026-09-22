# Time Fried Chicken · web sitesi

Astro ile üretilen statik site. Ziyaretçi tarafında JavaScript yok.
Genel plan ve mevzuat notları: [ON-HAZIRLIK-PLANI.md](ON-HAZIRLIK-PLANI.md)

## Çalıştırma

```bash
npm install
npm run dev       # geliştirme sunucusu (http://localhost:4321)
npm run build     # dist/ üretir + sıfır JS denetimi çalışır
npm run preview   # üretilen siteyi yerelde açar
```

Telefondan denemek için (aynı wifi ağında):

```bash
npx astro dev --host
```

## Yayınlama (Cloudflare Pages)

İki yol var. **İlk yayın için B daha hızlı, kalıcı düzen için A önerilir.**

### A. GitHub deposuna bağlayarak (önerilen)

1. Bu klasörü bir GitHub deposuna gönderin.
2. Cloudflare panelinde **Workers & Pages → Create → Pages → Connect to Git**.
3. Ayarlar:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Node sürümü: 20 veya üzeri
4. Her `git push` sonrası site otomatik güncellenir. Pull request'ler için ayrı önizleme adresi çıkar.

### B. Doğrudan yükleyerek (hızlı demo)

```bash
npm run build
npx wrangler pages deploy dist --project-name=timefriedchicken
```

İlk komutta tarayıcı açılıp Cloudflare hesabınızla giriş yapmanızı ister.
Sonuç: `https://timefriedchicken.pages.dev` gibi geçici bir adres. Alan adı bağlanınca timefriedchicken.com üzerinden yayına girer.

### Yayın sonrası

- **Alan adı:** timefriedchicken.com. Cloudflare Pages → Custom domains üzerinden bağlanır.
  `www` sürümü apex adrese yönlendirilir (Cloudflare → Redirect Rules).
- `public/_headers` güvenlik başlıklarını ve önbellek sürelerini taşır.
- `public/_redirects` içinde `/qr → /menu/` yönlendirmesi var. **Masadaki karekod `/qr`
  adresine basılmalı,** böylece menü düzeni değişse bile karekod geçerli kalır.

## Yayın öncesi kontrol listesi

- [ ] `src/data/menu.js` → gerçek **fiyatlar** (restoran içi, KDV dahil)
- [ ] `src/data/menu.js` → **gramajlar** (porsiyonun toplam ağırlığı)
- [ ] Alerjen kontrolü: `ALERJEN-KONTROL-LISTESI.xlsx` doldurulup veriye işlenecek
- [ ] `src/data/menu.js` → **`TASLAK = false`** (bu andan sonra eksik bilgi derlemeyi durdurur)
- [ ] `src/data/isletme.js` → ticari unvan, adres, telefon, vergi dairesi, sicil no
- [ ] Ürün fotoğrafları (16:11) ve mekân fotoğrafı
- [ ] Yasal sayfalar: KVKK aydınlatma metni, çerez politikası, künye
- [ ] Google Analytics + çerez onayı akışı (Cloudflare Pages Functions)
- [ ] Franchise ve iletişim formları (Airtable bağlantısı)

## Proje düzeni

```
src/data/menu.js         ürünler, kategoriler, TASLAK anahtarı
src/data/alerjenler.js   14 alerjenin tanımı
src/data/isletme.js      künye, saatler, platform linkleri
src/lib/dogrula.js       derleme anında veri doğrulama
src/components/          UrunKart, Ikon
src/layouts/Temel.astro  head, üst menü, footer
src/pages/               index, menu, alerjenler, siparis, 404
scripts/js-kontrol.mjs   üretilen sayfalarda JS var mı denetimi
public/                  _headers, _redirects, ikonlar.svg, fontlar, favicon
```

## Kurallar

- **Ziyaretçi tarafında JavaScript yok.** `npm run build` üretilen sayfalarda `<script>`
  bulursa derleme başarısız olur. İstisna: JSON-LD (yapılandırılmış veri, çalıştırılmaz).
- **Eksik veri yayına çıkamaz.** `TASLAK = false` iken fiyatı, gramajı veya alerjen
  bilgisi olmayan bir ürün derlemeyi durdurur.
- **Alerjen bilgisi tahminle doldurulmaz.** Kaynak, malzeme etiketleri ve tedarikçi
  şartnameleridir. Bilgi yoksa tabloda "?" gösterilir, "içermez" yazılmaz.
