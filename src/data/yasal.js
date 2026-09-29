// Yasal metinlerin ortak ayarları.
// taslak: true iken sayfaların başında "bu metin taslaktır" uyarısı çıkar.
// Avukat onayından ve künye bilgileri girildikten sonra false yapılacak.
export const YASAL = {
  taslak: true,

  // Metinlerin sürüm tarihi. Rıza kayıtlarında bu sürüm saklanacak.
  aydinlatmaSurumu: '2026-09-29',
  cerezSurumu: '2026-09-29',

  // Veri sahibi başvuruları için (KVKK md. 11 ve 13)
  basvuruEposta: '[kvkk@timefriedchicken.com]',

  // Yurt dışına aktarımın yapıldığı hizmet sağlayıcılar
  hizmetSaglayicilar: [
    { ad: 'Cloudflare, Inc.', ulke: 'ABD', amac: 'Sitenin barındırılması ve güvenliği, sunucu kayıtları' },
    { ad: 'Google LLC', ulke: 'ABD', amac: 'Ziyaret istatistikleri (yalnızca çerez onayı verildiyse)' },
    { ad: 'Airtable, Inc.', ulke: 'ABD', amac: 'Form başvurularının kaydedilmesi' },
  ],

  // Çerez politikasındaki tablo
  cerezler: [
    {
      ad: 'cerez_onay',
      tur: 'Zorunlu',
      amac: 'Çerez tercihinizi hatırlamak. Bu çerez olmadan her sayfada tekrar sorulur.',
      sure: '1 yıl',
      saglayici: 'timefriedchicken.com',
    },
    {
      ad: '_ga',
      tur: 'Analitik',
      amac: 'Google Analytics: ziyaretçileri birbirinden ayırt etmek.',
      sure: '2 yıl',
      saglayici: 'Google LLC',
    },
    {
      ad: '_ga_*',
      tur: 'Analitik',
      amac: 'Google Analytics: oturum durumunu tutmak.',
      sure: '2 yıl',
      saglayici: 'Google LLC',
    },
  ],
};
