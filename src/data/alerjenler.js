// Türk Gıda Kodeksi Gıda Etiketleme ve Tüketicileri Bilgilendirme Yönetmeliği
// (RG 26.01.2017/29960) Ek-1'deki 14 alerjen. Kodlar veri girişinde kullanılır.
export const ALERJENLER = {
  gluten:       { ad: 'Gluten', ikon: 'a-gluten' },
  kabuklular:   { ad: 'Kabuklular', ikon: 'a-kabuklular' },
  yumurta:      { ad: 'Yumurta', ikon: 'a-yumurta' },
  balik:        { ad: 'Balık', ikon: 'a-balik' },
  yerfistigi:   { ad: 'Yer fıstığı', ikon: 'a-yerfistigi' },
  soya:         { ad: 'Soya', ikon: 'a-soya' },
  sut:          { ad: 'Süt', ikon: 'a-sut' },
  sertkabuklu:  { ad: 'Sert kabuklu meyveler', kisa: 'Sert kabuklu', ikon: 'a-sertkabuklu' },
  kereviz:      { ad: 'Kereviz', ikon: 'a-kereviz' },
  hardal:       { ad: 'Hardal', ikon: 'a-hardal' },
  susam:        { ad: 'Susam', ikon: 'a-susam' },
  sulfit:       { ad: 'Kükürt dioksit ve sülfitler', kisa: 'Sülfit', ikon: 'a-sulfit' },
  acibakla:     { ad: 'Acı bakla', ikon: 'a-acibakla' },
  yumusakcalar: { ad: 'Yumuşakçalar', ikon: 'a-yumusakcalar' },
};

// Menü sayfasındaki "şu alerjen içermesin" süzgecinde gösterilecekler.
// Restoranın menüsünde sık geçen alerjenler seçilir.
export const SUZGEC_ALERJENLERI = ['gluten', 'sut', 'yumurta', 'susam', 'hardal', 'soya'];

export const alerjenAdi = (kod) => ALERJENLER[kod]?.ad ?? kod;
