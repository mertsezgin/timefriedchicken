# Tavuk Burger Restoranı Web Sitesi: Ön Hazırlık Planı

> Durum: Taslak v3 · 23.09.2026
> Hedefler: çok hızlı açılan, varsayılan olarak JavaScript'siz, ücretsiz barındırılan bir site. İçinde QR menü, alerjen tablosu, franchise başvuru formu ve Google Analytics olacak. Türk mevzuatına uyulacak.

**Netleşen kararlar**
- İşletme şu an şahıs firması.
- Sitede QR menü olacak ve fiyatlar sık güncellenecek.
- **Airtable yalnızca iki şey için:** menü (fiyat dahil) ve form kayıtları.
- **Alerjen tablosu Airtable'a bağlanmayacak,** sitede statik bir tablo olacak.
- **Google Analytics kurulacak.** Bu, çerez onay penceresini ve açık rıza sürecini zorunlu kılıyor (§5).
- İngilizce versiyon ikinci aşamada gelecek.
- 1 şube var, ayrıca franchise sayfası açılacak.
- Alerjen bilgisi dükkanda etiket kontrolüyle toplanacak → [ALERJEN-KONTROL-LISTESI.xlsx](ALERJEN-KONTROL-LISTESI.xlsx)

---

## 0. Marka

| | |
|---|---|
| Marka adı | **Time Fried Chicken** (kısa: TFC) |
| Logo | Horoz + çan işareti, "Time" kelime markası, altında el yazısı "Fried Chicken" |
| Kırmızı | `#e7272d` · koyu tonu `#c81f24` (üst menü zemini; beyaz yazıyla kontrast 5,7:1) |
| Sarı | `#fcbf44` (vurgu, düğmeler, fiyat) |
| Mavi | `#378fcd` (logodaki kelime markası rengi, sitede ölçülü kullanılır) |
| Koyu | `#1a1d21` (hero, ürün kartları) |
| Yazı tipi | **Rubik** (marka tasarımından geliyor, kendi sunucumuzdan yükleniyor, Türkçe karakterler dahil) |
| El yazısı | **Gleffy** (ticari font, yalnızca logoda, görsel olarak kullanılıyor) |

**Elimizdeki görseller** (`görsel-raw/`): logo varyasyonları (beyaz, siyah, kırmızı zeminli, işaret), bir adet tavuk burger fotoğrafı, kurye çizimi, 4 paket servis platformu logosu, bir de basılı tasarım PDF'i.

**Eksik görseller:** ürün fotoğrafları (her ürün için 16:11), mekân ve ekip fotoğrafı, hero için ikinci bir alternatif. Şu an ürün kartlarında yer tutucu kullanılıyor.

---

## 1. Mimari

```
          ┌──────── Airtable ────────┐
          │ Menü · Fiyat             │◄── Restoran telefondan fiyat günceller
          │ Form başvuruları         │
          └────┬────────────────▲────┘
derleme anında │ okur           │ form verisini yazar
               ▼                │
"Yayınla" linki → Cloudflare Pages derlemesi (Astro) → düz HTML + CSS
                                │           ▲
                                │           └── Alerjen tablosu: repodaki statik veri dosyası
                                │
  Ziyaretçi ◄── HTML/CSS ◄──────┤   (çerez onayı verildiyse + Google Analytics)
  Form POST ──► Pages Function ─┘
```

| Konu | Karar | Neden |
|---|---|---|
| Barındırma | **Cloudflare Pages** | Ücretsiz. `_headers` ile güvenlik başlıkları, `_redirects`, önizleme ortamları ve form işleme için **Pages Functions** sunuyor. GitHub Pages form verisini işleyemez. |
| Ziyaretçi tarafında JS | **Varsayılan olarak yok.** Yalnızca çerez onayı veren ziyaretçiye Google Analytics betiği yüklenir (§5). Onay vermeyen ya da hiç dokunmayan ziyaretçi sıfır JS'li sayfayı görür. | Performans ve KVKK |
| Form işleme | HTML `<form method="post">` → **Cloudflare Pages Function** → Airtable API | JS gerekmez. Airtable anahtarı sunucuda kalır, tarayıcıya hiç gitmez. Ücretsiz kotası (100.000 istek/gün) fazlasıyla yeterli. |
| İçerik yönetimi | **Airtable: yalnızca menü/fiyat ve form kayıtları** | Restoran fiyatı telefondan Airtable uygulamasıyla değiştirir. Kod bilgisi gerekmez. |
| Alerjen tablosu | **Repoda statik veri dosyası** (Airtable yok) | Nadiren değişir, kritik bilgidir ve değişikliği kayıt altında kalsın diye Git'te tutulur. Airtable kotasını da harcamaz. |
| Yayınlama | Derleme anında Airtable'dan veri çekilir, statik HTML üretilir | Sayfa açılışında veritabanına gidilmez, bu yüzden site hızlı kalır ve Airtable API kotası harcanmaz. |
| Derleme | **Astro** (`output: 'static'`) | Varsayılan çıktısı sıfır JS. Görsel optimizasyonu (`astro:assets`), şema doğrulamalı içerik koleksiyonları ve çok dillilik hazır geliyor. Node yalnızca derlemede çalışır. |

### "Fiyatı güncelle → sitede görünsün" akışı
1. İşletmeci Airtable'da (telefon uygulaması veya bilgisayar) fiyatı değiştirir.
2. Telefonda yer imi olarak kayıtlı **"Menüyü Yayınla"** linkine dokunur. Bu link şifre korumalı bir Pages Function'a gider ve Cloudflare derleme kancasını (deploy hook) tetikler.
3. Yaklaşık 1 dakika sonra QR menü dahil tüm sayfalar güncellenir. Sayfada "Son güncelleme" tarihi otomatik değişir.
4. Derleme sırasında veri doğrulaması çalışır. Fiyatı, gramajı ya da alerjen bilgisi eksik bir ürün varsa derleme **durur** ve eksik bilgi yayına çıkmaz. Canlı site eski haliyle kalır, işletmeciye hata bildirilir.

> Airtable ücretsiz planında kayıt sayısı ve aylık API çağrısı limitleri var (yazım anında yaklaşık 1.000 kayıt/base ve 1.000 çağrı/ay). Bir derleme birkaç çağrı harcar, form başvurularının her biri 1 çağrıdır. Küçük bir işletme için yeterli, ama kurulumda limitler teyit edilecek ve aşılırsa uyarı verecek bir kontrol eklenecek.

---

## 2. Sayfa haritası

```
/                      Ana sayfa
/menu/                 Menü = QR menü (mobil öncelikli, alerjen rozetleri, CSS ile alerjen filtresi)
/qr                    → /menu/ yönlendirmesi (masadaki karekod BURAYA gider, analitikte ayrıca sayılır)
/alerjenler/           Alerjen matrisi (yazdırılabilir A4)
/iletisim/             Adres, saatler, telefon, WhatsApp, statik harita + Google Maps linki, iletişim formu
/franchise/            Franchise tanıtımı + başvuru formu
/tesekkurler/          Form gönderimi sonrası
/kvkk/                 KVKK Aydınlatma Metni (genel)
/kvkk/franchise/       Franchise başvurusu aydınlatma metni
/cerez-politikasi/     Çerez politikası + kullanılan çerezlerin listesi
/cerez-tercihi/        Çerez tercihini değiştirme sayfası (onayı geri çekme)
/yasal-bilgiler/       Künye
/404.html
/en/…                  İngilizce karşılıklar (2. aşama; altyapı baştan kurulacak)
```

**QR kod kuralı:** Masadaki karekod `https://alanadi.com.tr/qr` adresine gider ve **bir daha değişmez.** Bu yüzden alan adı kalıcı olmalı ve süresinin dolmaması için otomatik yenilemeye alınmalı. Karekod SVG olarak üretilip basılır.

---

## 3. Mevzuat uyum listesi

> ⚠️ Bu liste hukuki danışmanlık değildir. Yayına almadan önce avukat veya mali müşavir ile teyit edilmelidir.

### 3.1 Künye (şahıs firması)
- **5651 md. 3 ve 6563 md. 3 (Ticari İletişim ve Ticari Elektronik İletiler Hk. Yönetmelik md. 5):** Aşağıdaki bilgiler sitede kolay erişilebilir olmalı:
  - işletme sahibinin adı soyadı ve işletme adı/unvanı
  - açık adres, telefon, e-posta, KEP adresi (varsa)
  - vergi dairesi
  - kayıtlı olunan sicil ve oda (esnaf ve sanatkâr sicili mi, ticaret sicili mi olduğu mali müşavirle netleştirilecek)
  - MERSİS numarası (tacir kaydı varsa)
- Şahıs firmalarında vergi kimlik numarası çoğu zaman **TC kimlik numarasıyla aynıdır.** TC kimlik numarası sitede yayımlanmamalı. Hangi numaranın gösterilmesi gerektiği müşavirle teyit edilecek.
- TTK md. 1524'teki (web sitesi / bilgi toplumu hizmetleri) yükümlülük **sermaye şirketleri** içindir, şahıs firmasına uygulanmaz. İleride şirketleşme olursa yeniden değerlendirilecek.

### 3.2 QR menü ve fiyat: Fiyat Etiketi Yönetmeliği (11.10.2025 değişikliği, uyum tarihi 01.01.2026)
- Masalarda fiyat listesi karekodla sunulabilir, fiziki menü **talep edilirse** verilir. Aynı veriden yazdırılabilir bir menü de üretilecek (`/menu/` sayfasının yazdırma görünümü).
- Her ürün için **ad, gramaj/ölçü ve tüm vergiler dahil TL fiyat** gösterilecek. Veri doğrulaması gramajı zorunlu tutacak.
- **Servis, kuver, masa ücreti** gibi kalemler olmayacak.
- İşletmede girişte asılı fiyat listesi yükümlülüğü devam ediyor. Bunun için aynı veriden A4/A3 çıktı alınacak.
- Bakanlığın belirlediği kriterlere giren işletmeler fiyat listelerini **Ticaret Bakanlığı elektronik sistemine** de aktarmak zorunda. Kapsamda olunup olunmadığı kontrol edilecek. Web sitesi bu bildirimin yerine geçmez.
- Sitedeki fiyat ile kasadaki fiyat **her zaman aynı** olmalı. Fiyat kasada değişince aynı gün "Yayınla" yapılacak. Bu bir süreç kuralı, personele yazılı olarak verilecek.
- Paket servis platformlarındaki fiyatlar farklıysa menüde "Fiyatlar restoran içi satış içindir" notu yer alacak.

### 3.3 Alerjen: Türk Gıda Kodeksi Etiketleme Yönetmeliği (RG 26.01.2017/29960, Ek-1)
- 14 alerjen, ambalajsız sunulan gıdalarda da tüketiciye bildirilmek zorunda.
- Yöntem: **dükkanda etiket kontrolü** → [ALERJEN-KONTROL-LISTESI.xlsx](ALERJEN-KONTROL-LISTESI.xlsx) (§7).
- Sitede "İçerir" ve "Eser miktarda içerebilir" ayrı gösterilecek, sayfada son güncelleme tarihi olacak ve şu not yer alacak: "Alerjiniz varsa sipariş öncesi personelimize bildiriniz."

### 3.4 KVKK: form ve analitik nedeniyle artık kapsamlı
**Veri sorumlusu:** şahıs firması sahibi (gerçek kişi).

| İşleme | Veriler | Amaç | Hukuki sebep (KVKK md. 5) |
|---|---|---|---|
| Franchise başvurusu | ad soyad, telefon, e-posta, şehir, yatırım bütçesi aralığı, mesaj | Başvuruyu değerlendirmek ve dönüş yapmak | md. 5/2-c (sözleşmenin kurulması), md. 5/2-f (meşru menfaat) |
| İletişim formu | ad, e-posta/telefon, mesaj | Talebe yanıt vermek | md. 5/2-f |
| Sunucu kayıtları | IP adresi, tarayıcı bilgisi, istenen sayfa | Güvenlik | md. 5/2-f, 5651 |
| **Google Analytics** | çerez kimliği, cihaz/tarayıcı, yaklaşık konum, gezinme davranışı | İstatistik ve pazarlama | **Açık rıza** (çerez onayı) |
| Pazarlama iletisi (isteğe bağlı) | e-posta/telefon | Kampanya bildirimi | **Açık rıza** + İYS kaydı |

Yükümlülükler:
- **Aydınlatma metni** her formun yanında linkli olacak. Kullanıcıdan "okudum" onayı alınır, ama bu onay açık rıza değildir ve ikisi karıştırılmamalı.
- **Açık rıza** yalnızca pazarlama iletisi için istenecek. Kutucuk ayrı olacak, varsayılan olarak işaretsiz olacak ve formu göndermenin şartı olmayacak.
- **Veri minimizasyonu:** TC kimlik numarası, doğum tarihi veya CV istenmeyecek. İş başvurusu formu yapılmayacak, çünkü CV'ler özel nitelikli veri riski taşır. İş başvuruları e-postayla alınacak.
- **Yurt dışına aktarım (KVKK md. 9, 7499 s. Kanun ile değişik):** Airtable (ABD), Cloudflare (ABD) ve **Google (ABD)** veri işleyen konumunda. Düzenli aktarım olduğu için **Kurul'un standart sözleşmesi** imzalanmalı ve imzadan sonra **5 iş günü içinde Kurum'a bildirilmeli.** Bu konuda avukat desteği alınmalı. Alternatif olarak form verisi Türkiye'de barındırılan bir sisteme yazılabilir, ama bu ücretsiz olmaz.
- **Saklama süresi:** Örneğin franchise başvurusu için 2 yıl, iletişim formu için 1 yıl. Süre dolunca Airtable'dan silinecek. Airtable'da bir "silinecek tarih" alanı tutulacak ve 3 ayda bir kontrol edilecek.
- **Güvenlik:** Airtable'da iki adımlı doğrulama açık olacak, erişim en az kişiyle sınırlı tutulacak, API anahtarı yalnızca ilgili tabloya yazma yetkili olacak ve Cloudflare'da gizli değişken (secret) olarak saklanacak.
- **Veri sahibi başvuruları (md. 11 ve 13):** Başvuru için e-posta adresi yazılacak ve 30 gün içinde yanıt verilecek.
- **VERBİS:** Çalışan sayısı ve ciro eşiklerinin altında kalan işletmeler genelde muaf. Mali müşavirle kontrol edilecek.
- **Çerezler:** Google Analytics kullanılacağı için **çerez onay penceresi ve açık rıza zorunlu** (§5). KVKK Çerez Uygulamaları Rehberi'ne göre zorunlu olmayan çerezler, kullanıcı onay vermeden **önce** çalıştırılamaz.

### 3.5 Franchise sayfası
- Türkiye'de franchise'a özel bir bilgilendirme kanunu yok. Yine de **Ticari Reklam Yönetmeliği** gereği kazanç, geri dönüş süresi veya ciro vaadi yazılmamalı. Somut rakam verilecekse kaynağı ve koşulları belirtilmeli.
- "Franchise" başvurusu bir sözleşme öncesi görüşme talebidir, form bunu açıkça söylemeli.
- Marka tescili franchise için **şart:** TÜRKPATENT'te 43. sınıf (restoran hizmetleri) ile 29. ve 30. sınıflarda tescil yapılmalı. Tescilsiz bir markanın franchise'ı verilemez ya da çok risklidir.

### 3.6 Reklam, içerik, marka
- Ürün fotoğrafları için **"Görseller temsilidir"** ibaresi konacak. Kanıtlanamayan üstünlük iddiaları ("en iyi", "1 numara") kullanılmayacak.
- Alkollü içecek varsa reklam ve tanıtım yasağına uyulacak (4250 / 4733 s. Kanunlar).
- "Helal", "organik", "katkısız" gibi beyanlar ancak belgeyle kullanılacak.
- Görsel, yazı tipi ve ikon lisansları kayıt altında tutulacak.
- Alan adı: `.com.tr` ve `.com` birlikte alınacak, 301 ile tek adrese yönlendirilecek.

### 3.7 Erişilebilirlik
- Yasal bir zorunluluk yok, ama **WCAG 2.2 AA** hedeflenecek. Alerjen tablosu ve formlar ekran okuyucuyla ve yalnızca klavyeyle kullanılabilir olmalı.

---

## 4. Formlar (JS'siz)

```html
<form method="post" action="/api/franchise">
  <!-- ad, telefon, e-posta, şehir, bütçe aralığı (select), mesaj -->
  <input type="text" name="website" hidden tabindex="-1" autocomplete="off"> <!-- bal tuzağı -->
  <label><input type="checkbox" name="aydinlatma" required> <a href="/kvkk/franchise/">Aydınlatma metnini</a> okudum.</label>
  <label><input type="checkbox" name="pazarlama_riza"> Kampanya ve duyurular için iletişime geçilmesine açık rıza veriyorum. (İsteğe bağlı)</label>
  <button>Başvur</button>
</form>
```
- **Doğrulama:** Önce tarayıcının kendi kontrolleri (`required`, `type="email"`, `pattern`), ardından sunucuda tekrar doğrulama. Hata olursa sunucu formu hata mesajları ve girilen değerlerle birlikte HTML olarak geri döndürür. JS gerekmez.
- **Spam koruması:**
  - bal tuzağı (honeypot) alanı
  - Cloudflare hız sınırı (rate limit) kuralı
  - sunucuda en kısa gönderim süresi kontrolü (form, zaman damgalı bir gizli alanla sunulur)
  - Turnstile JS gerektirdiği için kullanılmayacak.
- **Kayıt:** Pages Function veriyi Airtable'daki `Basvurular` tablosuna yazar. Kayda gönderim zamanı, aydınlatma onayı, açık rıza durumu ve metin sürümü de eklenir. Bu, ileride ispat için gereklidir.
- **Bildirim:** Yeni kayıtta Airtable otomasyonu işletmeciye e-posta gönderir.
- **Gönderim sonrası:** `303` ile `/tesekkurler/` sayfasına yönlendirilir, böylece sayfa yenilenince form tekrar gönderilmez.

---

## 5. Google Analytics ve çerez onayı

Google Analytics 4 kurulacak. GA4 JavaScript ve çerez gerektirir, KVKK'ya göre de **önceden açık rıza** ister. Bu ikisini şöyle bağdaştırıyoruz:

### Onaya bağlı yükleme (JS'siz çerez banner'ı)
1. Site varsayılan olarak **hiç JS ve hiç analitik çerezi olmadan** yüklenir.
2. Sayfanın altında bir banner çıkar. Bu banner bir JavaScript bileşeni değil, sıradan bir HTML formudur. İki düğmesi vardır: **"Kabul et"** ve **"Reddet"**. İkisi de aynı büyüklükte ve aynı görünürlüktedir (Kurul rehberi eşit seçenek istiyor).
3. Düğmeye basılınca form bir Cloudflare Pages Function'a gider, fonksiyon `cerez_onay=kabul` ya da `=ret` çerezini yazar ve kullanıcıyı aynı sayfaya geri yönlendirir.
4. Her HTML isteği bir Cloudflare ara katmanından (middleware) geçer. Bu katman çerezi okur:
   - onay varsa sayfaya GA4 etiketini ekler ve banner'ı göstermez
   - onay yoksa veya reddedilmişse **sayfaya hiçbir betik eklenmez**
5. Kullanıcı `/cerez-tercihi/` sayfasından kararını istediği zaman değiştirebilir. Reddedince GA çerezleri (`_ga`, `_ga_*`) sunucu tarafından silinir.

Sonuç: Ziyaretçilerin çoğu (onay vermeyenler) sıfır JS'li, çok hızlı sayfayı görür. Yalnızca onay verenlerde GA çalışır.

### Ek maliyetler ve dikkat edilecekler
- **Performans:** GA4 betiği yaklaşık 90–100 KB. Yalnızca onay verenlere yüklendiği ve `async` olduğu için LCP'ye etkisi sınırlı kalır. Lighthouse ölçümü onaysız durumda yapılacak (gerçek ortalama kullanıcı deneyimi budur), ayrıca onaylı durum için ikinci bir ölçüm alınacak.
- **Önbellek:** HTML yanıtları çereze göre değiştiği için HTML `private` olarak işaretlenecek, statik dosyalar (CSS, görsel, font) eskisi gibi uzun süreli önbelleklenecek.
- **CSP:** `script-src https://www.googletagmanager.com` ve `connect-src https://*.google-analytics.com https://*.analytics.google.com` izinleri yalnızca onaylı sayfalara eklenecek.
- **GA4 ayarları:** Veri saklama 14 ay, Google Signals **kapalı**, reklam kişiselleştirme **kapalı**, IP anonimleştirme (GA4'te varsayılan), Google ile veri işleme şartları (DPA) kabul edilmiş olacak.
- **KVKK belgeleri:** Çerez politikasında `_ga` ve `_ga_*` çerezleri, süreleri (2 yıl) ve amaçları tek tek listelenecek. Aydınlatma metninde Google LLC'ye (ABD) aktarım yer alacak ve **standart sözleşme + Kurum'a bildirim** süreci bunu da kapsayacak.
- **Rıza kaydı:** Onay/ret kararı, zaman damgası ve metin sürümü sunucu tarafında anonim olarak kaydedilecek (ispat yükümlülüğü için).
- **Ölçüm:** QR taramaları `/qr` yönlendirmesiyle, kampanya kaynakları `?utm_source=` etiketleriyle ayrıştırılacak. Onaysız ziyaretçiler GA'da görünmeyeceği için gerçek trafik daha yüksek olacak. Toplam trafiği Cloudflare'in kendi sunucu tarafı raporundan takip edip GA rakamıyla karşılaştıracağız.

---

## 6. Performans bütçesi ve teknik standartlar

**Hedefler (mobil, yavaş 4G):** LCP < 1,5 sn · CLS = 0 · Lighthouse 100 · QR menü sayfası < 50 KB (görselsiz ilk yükleme)

| Kalem | Bütçe |
|---|---|
| HTML (sayfa başı, gzip) | < 25 KB |
| CSS | < 15 KB. Kritik kısım HTML içine gömülür. |
| Yazı tipi | En fazla 2 adet `woff2`, Türkçe karakter alt kümesi, kendi sunucumuzdan yüklenir |
| Görseller | AVIF/WebP, `srcset`, `width`/`height` yazılı. Hero ≤ 80 KB, geri kalanı `loading="lazy"`. **QR menüde ürün görselleri küçük tutulacak** (mağaza içi mobil veri düşünülerek). |
| Logo | SVG, HTML içine gömülü |

**JS'siz etkileşimler:**
- Alerjen filtresi: `:has()` + checkbox
- Mobil menü ve açılır bölümler: `<details>`
- Kategori çubuğu: yapışkan (`sticky`) + çapa (`#anchor`) linkleri
- Koyu mod: `prefers-color-scheme`

**`_headers`:** CSP (`default-src 'none'`, `form-action 'self'`, analitik istisnası), HSTS, `nosniff`, `Referrer-Policy`, `Permissions-Policy`. Hash'li dosyalar için 1 yıl `immutable` önbellek, HTML için `must-revalidate`.

**SEO:**
- `Restaurant` + `Menu` JSON-LD, `hreflang` (tr/en), Open Graph görselleri, `sitemap.xml`
- **Google İşletme Profili:** Menü linki olarak `/menu/` verilecek.

**Kalite kontrol (her PR'da GitHub Actions):** Lighthouse CI, HTML doğrulama, erişilebilirlik testi (axe/pa11y), kırık link kontrolü, veri doğrulama.

---

## 7. Alerjen süreci ve Airtable veri modeli

### 7.1 Dükkanda kontrol → [ALERJEN-KONTROL-LISTESI.xlsx](ALERJEN-KONTROL-LISTESI.xlsx)
| Sayfa | İçerik |
|---|---|
| Nasıl Kullanılır | Adım adım talimat, renk kodları |
| **Malzemeler** | 38 tipik malzeme hazır, boş satırlar ekleme için. Her malzeme için 14 alerjen Var/Eser/Yok olarak açılır listeden seçilir. Marka, etiket fotoğrafı, kontrol tarihi ve kontrol eden kişi de girilir. Sık rastlanan alerjenin hücresi turuncu çerçeveyle vurgulanır. Durum sütunu eksikleri sayar. |
| Reçeteler | Ürün ve malzeme eşleşmeleri |
| **Alerjen Matrisi** | Otomatik hesaplanır. Bir malzemede "Var" varsa ürün de "Var" olur. Kontrol edilmemiş malzeme varsa ürün "Bilinmiyor" olur, yayına hazır görünmez. Alt kısımda onay/imza satırı var. |
| Mutfak Kontrolü | Ortak fritöz, ortak kaşık gibi çapraz bulaşma soruları |
| Etiket Sözlüğü | Etikette hangi kelimenin hangi alerjene karşılık geldiği (ör. peynir altı suyu → süt, E220–E228 → sülfit) |

Excel dükkanda çevrimdışı kullanılabilir ve yazdırılabilir. **Excel bu işin ana kaynağıdır ve Airtable'a taşınmayacak.**

### 7.2 Excel'den siteye
1. Excel'deki "Alerjen Matrisi" sayfası tamamlanıp onaylanır.
2. Bu sayfa CSV olarak dışa aktarılıp repoya konur: `src/_data/alerjenler.csv`.
3. Derleme, bu dosyadan `/alerjenler/` sayfasındaki tabloyu üretir (ekran okuyucuya uygun HTML tablo + yazdırma görünümü).
4. Menü değişince veya tedarikçi değişince Excel güncellenir, CSV yeniden aktarılır, commit edilir. Git geçmişi sayesinde **hangi bilginin ne zaman değiştiği kayıtlı kalır.** Bu, olası bir şikâyet veya denetimde işe yarar.
5. Sayfada "Son güncelleme" ve "Onaylayan" bilgisi görünür.

> Elle HTML tablo yazmak yerine CSV kullanmamızın tek sebebi şu: 14 sütunlu bir tabloyu elle yazmak hataya çok açık. CSV'de tek satır değiştirmek yeterli. İsterseniz doğrudan HTML olarak da tutabiliriz, karar sizde.

### 7.3 Menü ile alerjen tablosunun ilişkisi
Menü Airtable'da, alerjen tablosu repoda olduğu için ikisi ayrı yerlerde duruyor. Tutarsızlığı önlemek için:
- **Önerilen:** Menüde ürün başına alerjen rozeti gösterilmez, bunun yerine her ürün ve her kategori "Alerjen tablosu" sayfasına link verir. Tek kaynak, çelişki riski yok.
- **Alternatif:** Airtable'daki ürün kaydına 14 seçenekli bir "alerjenler" alanı eklenir ve rozetler menüde gösterilir. Daha kullanışlı ama iki yeri birden güncellemek gerekir. Bu seçilirse derleme, menüdeki her ürünün alerjen tablosunda da bulunmasını kontrol eder, bulunmuyorsa yayını durdurur.
- Her iki durumda da yeni ürün eklenince önce alerjen kontrolü yapılır, sonra ürün menüde yayına alınır.

### 7.4 Airtable tabloları (yalnız menü ve formlar)
```
Urunler      : ad_tr, ad_en, aciklama_tr, aciklama_en, kategori, gramaj, fiyat (KDV dahil),
               gorsel, aktif, sira[, alerjenler (yukarıdaki alternatif seçilirse)]
Kategoriler  : ad_tr, ad_en, sira
Ayarlar      : saatler, telefon, adres, künye bilgileri, duyuru bandı
Basvurular   : tur (franchise/iletişim), form alanları, zaman, aydinlatma_surum, riza, silinecek_tarih
```
Derleme doğrulamaları: aktif her üründe fiyat ve gramaj dolu olmalı, fiyat 0'dan büyük olmalı, EN çevirisi eksikse Türkçe metin kullanılıp uyarı verilmeli.

---

## 8. Proje yapısı

```
tfc-website/
├─ src/
│  ├─ layouts/            Temel.astro (head, header, footer)
│  ├─ components/         UrunKart.astro, KategoriKart.astro, AlerjenRozet.astro, CerezBanner.astro
│  ├─ content/            config.ts (Zod şeması), alerjenler.csv, sabit metinler
│  ├─ lib/                airtable.ts (menüyü çeker + doğrular), i18n.ts
│  ├─ styles/             main.css
│  ├─ assets/             görseller (derlemede AVIF/WebP'ye çevrilir), fontlar
│  └─ pages/
│     ├─ index.astro, menu.astro, alerjenler.astro, iletisim.astro, siparis.astro, franchise.astro
│     └─ en/              (2. aşama)
├─ functions/             Cloudflare Pages Functions (Astro'dan bağımsız)
│  ├─ api/franchise.js    form → Airtable
│  ├─ api/iletisim.js
│  ├─ api/cerez.js        çerez onayı / reddi yazar, rıza kaydı tutar
│  ├─ _middleware.js      onay varsa GA etiketini sayfaya ekler, yoksa hiçbir betik eklemez
│  └─ yayinla.js          şifre korumalı deploy tetikleyici
├─ public/                _headers, _redirects, robots.txt, ikonlar.svg
├─ .github/workflows/ci.yml
└─ astro.config.mjs
```

**Astro için kurallar (sıfır JS'i korumak adına):**
- `output: 'static'`, hiçbir bileşende `client:*` yönergesi yok, `<ViewTransitions />` kullanılmıyor.
- CI'da bir kontrol: üretilen `dist/` içinde `<script` geçen bir sayfa varsa derleme başarısız olur. Tek istisna, çerez onayından sonra ara katmanın eklediği GA etiketi (o zaten derleme çıktısında yer almaz).

---

## 9. Aşamalar

| # | Aşama | Çıktı | Süre |
|---|---|---|---|
| 0 | **Bilgi toplama + alerjen kontrolü** | Excel dosyası dolu, künye bilgileri, menü, gramajlar | Restorana bağlı |
| 1 | İskelet | Git deposu, Astro, Cloudflare Pages önizleme, `_headers`, CI (sıfır JS kontrolü dahil) | 1 gün |
| 2 | Airtable kurulumu | Menü ve form tabloları, derleme anında veri çekme + doğrulama, "Yayınla" linki | 1–2 gün |
| 3 | Tasarım sistemi | Tokenlar, bileşenler (logo gelince renkler kesinleşir) | 1–2 gün |
| 4 | QR menü + alerjen tablosu | `/menu/` (Airtable), `/alerjenler/` (CSV), yazdırma görünümleri, karekod SVG | 2 gün |
| 5 | Diğer sayfalar | Ana sayfa, iletişim, franchise, yasal sayfalar | 1–2 gün |
| 6 | Formlar | Pages Functions, doğrulama, spam koruması, Airtable yazımı, e-posta bildirimi | 1–2 gün |
| 7 | Analitik + çerez onayı | GA4 hesabı ve ayarları, çerez banner'ı (JS'siz), ara katman, `/cerez-tercihi/`, çerez politikası, rıza kaydı | 1–1,5 gün |
| 8 | Görseller | Logo ve fotoğraflar gelince optimizasyon, OG görselleri, favicon | 0,5–1 gün |
| 9 | Kalite | Lighthouse, erişilebilirlik, gerçek cihazla QR testi | 1 gün |
| 10 | Hukuki gözden geçirme | Aydınlatma metinleri, standart sözleşme + Kurum bildirimi, künye onayı | Dış bağımlı |
| 11 | Yayın | DNS, HTTPS, Google İşletme Profili, Search Console, karekodların basılması | 0,5 gün |
| 12 | İngilizce | `/en/` içerikleri, Airtable'daki `_en` alanları | 1–2 gün |

---

## 10. Restorandan istenecek bilgiler

**Künye (şahıs firması)**
- [ ] İşletme sahibinin adı soyadı, işletme adı / tabela adı
- [ ] Vergi dairesi, kayıtlı olunan sicil ve oda (esnaf/ticaret), MERSİS no (varsa)
- [ ] Adres, telefon, e-posta, KEP (varsa)
- [ ] KVKK başvuruları için e-posta adresi

**Menü**
- [ ] Ürünler: ad, açıklama, **gramaj**, **KDV dahil fiyat**, kategori
- [ ] Menü/kombo içerikleri, ekstralar
- [ ] Alkollü içecek var mı? Paket servis platform fiyatları farklı mı?

**Alerjen**
- [ ] Doldurulmuş [ALERJEN-KONTROL-LISTESI.xlsx](ALERJEN-KONTROL-LISTESI.xlsx) + etiket fotoğrafları

**Franchise**
- [ ] Franchise modeli hakkında paylaşılabilecek bilgiler (metrekare, konum kriterleri, süreç adımları; kazanç vaadi olmadan)
- [ ] Başvuruların bildirileceği e-posta
- [ ] Marka tescil durumu

**Marka ve içerik**
- [ ] Logo (SVG), renkler, fotoğraflar, hakkımızda metni
- [ ] Sosyal medya ve paket servis platform linkleri
- [ ] Alan adı

---

## 11. Açık sorular
1. **Yurt dışına aktarım:** Airtable, Cloudflare ve Google için standart sözleşme ve Kurum bildirimi sürecini yürütecek bir avukat var mı? Google Analytics kararı bu adımı zorunlu hale getirdi.
2. **Menüde alerjen rozeti:** Tek kaynak için rozetsiz (önerilen) mi, yoksa Airtable'a alerjen alanı ekleyip rozetli mi? (§7.3)
3. Mevcut bir Google Analytics / Google hesabı var mı, yoksa yeni mi açılacak? Google İşletme Profili ile aynı hesap kullanılması iyi olur.
4. Airtable'a kim erişecek? (Önerilen: en fazla 2 kişi, iki adımlı doğrulama açık)
5. Marka TÜRKPATENT'te tescilli mi? Franchise için şart.
6. Kalori bilgisi eklenecek mi? Şu an zorunlu değil, ama Airtable'da alanı hazır tutulacak.
