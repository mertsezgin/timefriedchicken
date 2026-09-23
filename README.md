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

## Yayınlama

- Depo: github.com/mertsezgin/timefriedchicken
- Alan adı: timefriedchicken.com (Cloudflare)

Dallar:

| Dal | Ne besliyor |
|---|---|
| `main` | Canlıdaki "Yapım Aşamasındayız" sayfası (tek HTML dosyası) |
| `yeni-site` | Bu Astro projesi. Veriler tamamlanınca `main` ile birleştirilecek. |

### Demo / önizleme adresi (canlı siteye dokunmaz)

```bash
npx wrangler login
npm run build
npx wrangler pages deploy dist --project-name=tfc-onizleme
```

Sonuç `https://tfc-onizleme.pages.dev` olur. Ayrı bir Cloudflare projesi olduğu için
timefriedchicken.com etkilenmez.

### Canlıya alma (veriler hazır olunca)

1. `src/data/menu.js` içinde **`TASLAK = false`** yapın. Eksik fiyat, gramaj veya alerjen
   bilgisi varsa derleme durur, yani eksik veri yayına çıkamaz.
2. `yeni-site` dalını `main` ile birleştirin.
3. Cloudflare → Workers & Pages → **timefriedchicken** → Settings → Build:
   - Build command: `npm run build`
   - Deploy command: `npx wrangler deploy` (yapılandırma `wrangler.jsonc` dosyasında)
4. Custom domains bölümünde timefriedchicken.com ve www bağlı olmalı.
   www → apex yönlendirmesi Cloudflare → Rules → Redirect Rules ile yapılır.

### Yayın sonrası

- `public/_headers` güvenlik başlıklarını ve önbellek sürelerini taşır.
- `public/_redirects` içinde `/qr → /menu/` yönlendirmesi var. **Masadaki karekod
  `timefriedchicken.com/qr` adresine basılmalı,** böylece menü düzeni değişse bile
  karekod geçerli kalır.

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
