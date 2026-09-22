import { ALERJENLER } from '../data/alerjenler.js';

/**
 * Menü verisini derleme anında doğrular.
 *
 * taslak = true  → eksikler uyarı olarak listelenir, derleme devam eder.
 * taslak = false → eksik bilgi derlemeyi durdurur, yani yayına çıkamaz.
 *
 * Zorunlu alanların kaynağı Fiyat Etiketi Yönetmeliği (ad, gramaj/ölçü, KDV dahil fiyat)
 * ve Türk Gıda Kodeksi Etiketleme Yönetmeliği (alerjen bildirimi).
 */
export function menuyuDogrula(urunler, kategoriler, taslak = false) {
  const hatalar = [];   // her durumda derlemeyi durdurur
  const eksikler = [];  // taslakta uyarı, yayında hata

  const kodlar = new Set();
  const kategoriKodlari = new Set(kategoriler.map((k) => k.kod));

  for (const u of urunler) {
    const nerede = u.kod || u.ad || '(kodsuz ürün)';

    if (!u.kod) hatalar.push(`${nerede}: kod alanı boş`);
    else if (kodlar.has(u.kod)) hatalar.push(`${nerede}: aynı kod birden fazla üründe kullanılmış`);
    kodlar.add(u.kod);

    if (!u.ad?.trim()) hatalar.push(`${nerede}: ad boş`);
    if (!kategoriKodlari.has(u.kategori)) hatalar.push(`${nerede}: tanımsız kategori "${u.kategori}"`);

    for (const a of [...(u.alerjenler ?? []), ...(u.eser ?? [])]) {
      if (!ALERJENLER[a]) hatalar.push(`${nerede}: tanımsız alerjen kodu "${a}"`);
    }

    if (u.aktif === false) continue;

    if (!u.porsiyon?.trim()) eksikler.push(`${nerede}: porsiyon/gramaj yok`);
    if (typeof u.fiyat !== 'number' || !(u.fiyat > 0)) eksikler.push(`${nerede}: fiyat yok`);
    if (!Array.isArray(u.alerjenler)) eksikler.push(`${nerede}: alerjen kontrolü yapılmamış`);
  }

  if (hatalar.length) {
    throw new Error(`Menü verisinde ${hatalar.length} hata:\n  - ` + hatalar.join('\n  - '));
  }

  if (eksikler.length) {
    if (!taslak) {
      throw new Error(
        `Menüde ${eksikler.length} eksik bilgi var, bu haliyle yayına çıkamaz:\n  - ` + eksikler.join('\n  - ')
      );
    }
    // taslak: tek satırlık özet, ayrıntı gerekirse aşağıdaki liste
    const ozet = {};
    for (const e of eksikler) {
      const tur = e.split(': ')[1];
      ozet[tur] = (ozet[tur] ?? 0) + 1;
    }
    console.warn(
      '[menü/taslak] Eksik bilgiler: ' +
      Object.entries(ozet).map(([t, n]) => `${n} üründe ${t}`).join(', ') +
      ' · Yayın öncesi menu.js içindeki TASLAK değerini false yapın.'
    );
  }

  return { eksikSayisi: eksikler.length, eksikler };
}

export const fiyatYaz = (tl) =>
  new Intl.NumberFormat('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(tl) + ' ₺';

export const tarihYaz = (iso) =>
  new Intl.DateTimeFormat('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(iso));
