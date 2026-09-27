// Künye ve işletme bilgileri. Köşeli parantezli alanlar hâlâ işletmeden bekleniyor.
export const isletme = {
  marka: 'Time',
  markaAlt: 'Fried Chicken',
  slogan: 'Tavuğun en çıtırı.',
  ozet: 'Çıtır tavuk burger, wings ve tenders. Halkalı, İstanbul.',

  telefon: '0535 397 30 82',
  telefonHam: '+905353973082',
  whatsapp: 'https://wa.me/905353973082',

  adres: 'Atakent Mah. Ihlamur Evleri Site Sk. No: 40/1, İç Kapı No: 2',
  semt: 'Halkalı',
  ilce: 'Küçükçekmece / İstanbul',
  postaKodu: '34307',
  haritaLinki: 'https://www.google.com/maps/search/?api=1&query=Atakent+Mah.+Ihlamur+Evleri+Site+Sk.+No+40%2F1+34307+K%C3%BC%C3%A7%C3%BCk%C3%A7ekmece+%C4%B0stanbul',

  // Künye için: mali müşavirden gelecek
  unvan: '[ticari unvan]',
  vergiDairesi: '[vergi dairesi]',
  sicil: '[sicil no]',

  saatler: [
    { gun: 'Pazartesi – Cumartesi', saat: '11.00 – 22.00' },
    { gun: 'Pazar', saat: '12.00 – 22.00' },
  ],
  kisaSaat: '11.00 – 22.00',

  // schema.org için makine okunur hâli
  saatlerYapisal: [
    { gunler: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], acilis: '11:00', kapanis: '22:00' },
    { gunler: ['Sunday'], acilis: '12:00', kapanis: '22:00' },
  ],
};

export const platformlar = [
  { ad: 'Trendyol Go',  kod: 'trendyol',    url: '#' },
  { ad: 'Yemeksepeti',  kod: 'yemeksepeti', url: '#' },
  { ad: 'Getir Yemek',  kod: 'getir',       url: '#' },
  { ad: 'Migros Yemek', kod: 'migrosyemek', url: '#' },
];
