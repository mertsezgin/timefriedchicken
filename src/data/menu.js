// Menü verisi. Kaynak: Yemeksepeti sayfasındaki ürün listesi (23.09.2026).
// Airtable bağlandığında bu dosyanın yerini src/lib/airtable.js alacak, şema aynı kalacak.
//
// TASLAK = true iken eksik fiyat/gramaj/alerjen derlemeyi durdurmaz, sadece uyarı basar.
// Yayına çıkmadan önce false yapılacak; o zaman eksik bilgi derlemeyi durdurur.
export const TASLAK = true;

export const guncelleme = '2026-09-23';

export const kategoriler = [
  { kod: 'menuler',   ad: 'Menüler',    ikon: 'i-menu-tumu' },
  { kod: 'burgerler', ad: 'Burgerler',  ikon: 'i-hamburger' },
  { kod: 'wings',     ad: 'Wings',      ikon: 'i-wings' },
  { kod: 'tenders',   ad: 'Tenders',    ikon: 'i-tenders' },
  { kod: 'specials',  ad: 'Specials',   ikon: 'i-special' },
  { kod: 'soslar',    ad: 'Soslar',     ikon: 'a-hardal' },
  { kod: 'icecekler', ad: 'İçecekler',  ikon: 'i-icecek' },
];

/**
 * Alan notları:
 *  porsiyon : gramaj/ölçü. Fiyat Etiketi Yönetmeliği gereği yayında zorunlu.
 *  fiyat    : KDV dahil TL. null = restorandan alınacak (platform fiyatları kullanılmaz).
 *  aci      : 1 = hafif acı, 2 = acı. Alan yoksa acı değil.
 *  alerjenler / eser : null = henüz etiket kontrolü yapılmadı (ALERJEN-KONTROL-LISTESI.xlsx).
 *                      Boş dizi [] = kontrol edildi, alerjen içermiyor.
 */
export const urunler = [
  // ---------- Menüler ----------
  {
    kod: 'friend-time-menu', ad: "2'li Friend Time Menü", kategori: 'menuler',
    aciklama: '2 adet TFC Basic Time Burger, 2 adet TFC Basic Tenders, 2 adet TFC Basic Wings, 2 adet seçeceğiniz içecek, patates kızartması ve 2 adet ranch sos.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aktif: true,
  },
  {
    kod: 'combo-time-menu', ad: 'Combo Time Menü', kategori: 'menuler',
    aciklama: 'Seçeceğiniz burger, 3 adet Basic Chicken Tenders, 3 adet Basic Chicken Wings, patates kızartması, ranch sos.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, oneCikan: true, aktif: true,
  },

  // ---------- Burgerler ----------
  {
    kod: 'basic-time-burger', ad: 'Basic Time Burger', kategori: 'burgerler',
    aciklama: 'Kızartılmış TFC tavuk, iceberg marul, sweet mayonez, cheddar peyniri, Alman turşusu, patates kızartması.',
    porsiyon: '150 g tavuk', fiyat: null, alerjenler: null, eser: null, oneCikan: true, aktif: true,
  },
  {
    kod: 'bbq-time-burger', ad: 'BBQ Time Burger', kategori: 'burgerler',
    aciklama: 'Kızarmış barbekü soslu TFC tavuk, iceberg marul, sweet mayonez, patates kızartması.',
    porsiyon: '150 g tavuk', fiyat: null, alerjenler: null, eser: null, aktif: true,
  },
  {
    kod: 'spicy-time-burger', ad: 'Spicy Time Burger', kategori: 'burgerler',
    aciklama: 'Kızarmış acı soslu TFC tavuk, iceberg marul, patates kızartması.',
    porsiyon: '150 g tavuk', fiyat: null, alerjenler: null, eser: null, oneCikan: true, aci: 1, aktif: true,
  },
  {
    kod: 'special-one-burger', ad: 'Special One Burger', kategori: 'burgerler',
    aciklama: 'Kızartılmış TFC tavuk, garlic sos, jalapeño biberi, iceberg marul, cips, tatlı Alman turşusu, cheddar peyniri, patates kızartması.',
    porsiyon: '150 g tavuk', fiyat: null, alerjenler: null, eser: null, aktif: true,
  },
  {
    kod: 'purple-time-burger', ad: 'Purple Time Burger', kategori: 'burgerler',
    aciklama: 'Kızarmış TFC tavuk, kırmızı mor lahana sos, ballı hardal, pickles sos, patates kızartması.',
    porsiyon: '150 g tavuk', fiyat: null, alerjenler: null, eser: null, aktif: true,
  },

  // ---------- Wings ----------
  {
    kod: 'basic-wings-6', ad: "6'lı Basic Chicken Wings", kategori: 'wings',
    aciklama: '6 adet Basic Chicken Wings, patates kızartması.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aktif: true,
  },
  {
    kod: 'basic-wings-10', ad: "10'lu Basic Chicken Wings", kategori: 'wings',
    aciklama: '10 adet Basic Chicken Wings, patates kızartması.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, oneCikan: true, aktif: true,
  },
  {
    kod: 'fire-wings-6', ad: "6'lı Fire Chicken Wings", kategori: 'wings',
    aciklama: '6 adet acı baharatlı Fire Chicken Wings, patates kızartması.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aci: 2, aktif: true,
  },
  {
    kod: 'fire-wings-10', ad: "10'lu Fire Chicken Wings", kategori: 'wings',
    aciklama: '10 adet acı baharatlı Fire Chicken Wings, patates kızartması.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aci: 2, aktif: true,
  },

  // ---------- Tenders ----------
  {
    kod: 'basic-tenders-5', ad: "5'li Basic Chicken Tenders", kategori: 'tenders',
    aciklama: '5 adet Basic Chicken Tenders, patates kızartması.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, oneCikan: true, aktif: true,
  },
  {
    kod: 'basic-tenders-9', ad: "9'lu Basic Chicken Tenders", kategori: 'tenders',
    aciklama: '9 adet Basic Chicken Tenders, patates kızartması.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aktif: true,
  },
  {
    kod: 'fire-tenders-5', ad: "5'li Fire Chicken Tenders", kategori: 'tenders',
    aciklama: '5 adet Fire Chicken Tenders, patates kızartması.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aci: 2, aktif: true,
  },
  {
    kod: 'fire-tenders-9', ad: "9'lu Fire Chicken Tenders", kategori: 'tenders',
    aciklama: '9 adet Fire Chicken Tenders, patates kızartması.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aci: 2, aktif: true,
  },

  // ---------- Specials ----------
  {
    kod: 'time-top-chicken', ad: 'Time Top Chicken', kategori: 'specials',
    aciklama: 'Kızartılmış acı soslu susamlı tavuk parçaları, patates kızartması, ranch sos.',
    porsiyon: '250 g', fiyat: null, alerjenler: null, eser: null, aci: 2, aktif: true,
  },

  // ---------- Soslar ----------
  {
    kod: 'sos-paketi-4', ad: "4'lü Sos Paketi", kategori: 'soslar',
    aciklama: 'Ranch sos, acı sos, ballı hardal sos ve barbekü sos.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aktif: true,
  },
  {
    kod: 'garlic-sos', ad: 'Garlic Sos', kategori: 'soslar',
    aciklama: 'Adet olarak servis edilir.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aktif: true,
  },
  {
    kod: 'aci-sos', ad: 'Acı Sos', kategori: 'soslar',
    aciklama: 'Adet olarak servis edilir.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aci: 2, aktif: true,
  },
  {
    kod: 'spicy-sos', ad: 'Spicy Sos', kategori: 'soslar',
    aciklama: 'Adet olarak servis edilir.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aci: 1, aktif: true,
  },
  {
    kod: 'ranch-sos', ad: 'Ranch Sos', kategori: 'soslar',
    aciklama: 'Adet olarak servis edilir.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aktif: true,
  },
  {
    kod: 'balli-hardal-sos', ad: 'Ballı Hardal Sos', kategori: 'soslar',
    aciklama: 'Adet olarak servis edilir.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aktif: true,
  },
  {
    kod: 'barbeku-sos', ad: 'Barbekü Sos', kategori: 'soslar',
    aciklama: 'Adet olarak servis edilir.',
    porsiyon: null, fiyat: null, alerjenler: null, eser: null, aktif: true,
  },

  // ---------- İçecekler ----------
  { kod: 'coca-cola', ad: 'Coca-Cola', kategori: 'icecekler', aciklama: '', porsiyon: '330 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'coca-cola-zero', ad: 'Coca-Cola Zero Sugar', kategori: 'icecekler', aciklama: '', porsiyon: '330 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'coca-cola-light', ad: 'Coca-Cola Light', kategori: 'icecekler', aciklama: '', porsiyon: '330 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'fanta', ad: 'Fanta', kategori: 'icecekler', aciklama: '', porsiyon: '330 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'sprite', ad: 'Sprite', kategori: 'icecekler', aciklama: '', porsiyon: '330 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'fuse-tea-seftali', ad: 'Fuse Tea Şeftali', kategori: 'icecekler', aciklama: '', porsiyon: '330 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'fuse-tea-limon', ad: 'Fuse Tea Limon', kategori: 'icecekler', aciklama: '', porsiyon: '330 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'fuse-tea-karpuz', ad: 'Fuse Tea Karpuz', kategori: 'icecekler', aciklama: '', porsiyon: '330 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'fuse-tea-mango-ananas', ad: 'Fuse Tea Mango ve Ananas', kategori: 'icecekler', aciklama: '', porsiyon: '330 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'ayran', ad: 'Ayran', kategori: 'icecekler', aciklama: 'Sütaş büyük boy ayran.', porsiyon: '300 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'soda', ad: 'Soda', kategori: 'icecekler', aciklama: '', porsiyon: '200 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
  { kod: 'su', ad: 'Su', kategori: 'icecekler', aciklama: '', porsiyon: '500 ml', fiyat: null, alerjenler: null, eser: null, aktif: true },
];
