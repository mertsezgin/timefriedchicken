/**
 * Cloudflare Worker: statik dosyaları sunar, /api/ altındaki form gönderimlerini karşılar.
 *
 * Şu an form kayıtları henüz bir yere yazılmıyor (Airtable bağlantısı kurulmadı).
 * O yüzden gönderim denemesine dürüst bir cevap dönüyoruz: kaydedemedik, telefonla ulaşın.
 * Airtable bağlanınca kaydetVeYonlendir() içi doldurulacak, sayfa tarafında değişiklik gerekmeyecek.
 */

const TELEFON = '0535 397 30 82';
const TELEFON_HAM = '+905353973082';

const sayfa = (baslik, govde, durum = 200) =>
  new Response(
    `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${baslik} · Time Fried Chicken</title>
<meta name="robots" content="noindex">
<style>
:root{--kirmizi:#e7272d;--sari:#fcbf44;--koyu:#1a1d21;--cizgi:#e6e2da}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#1f1f1f;background:#fff8ee}
.kutu{max-width:560px;background:#fff;border:1px solid var(--cizgi);border-radius:18px;
padding:34px 30px;box-shadow:0 6px 20px rgba(34,40,49,.1);text-align:center}
h1{font-size:1.5rem;margin:0 0 .5em;line-height:1.2}
p{margin:0 0 1em;color:#33373d}
.dugmeler{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:22px}
a.dugme{display:inline-flex;align-items:center;gap:.5em;padding:.8em 1.5em;border-radius:999px;
font-weight:700;text-decoration:none;border:2px solid transparent}
.birincil{background:var(--kirmizi);color:#fff}
.ikincil{border-color:var(--koyu);color:var(--koyu)}
</style></head><body><main class="kutu">${govde}
<div class="dugmeler">
<a class="dugme birincil" href="tel:${TELEFON_HAM}">${TELEFON}</a>
<a class="dugme ikincil" href="/">Ana sayfa</a>
</div></main></body></html>`,
    { status: durum, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
  );

async function formuIsle(request, env, yol) {
  if (request.method !== 'POST') {
    return Response.redirect(new URL(yol === '/api/franchise' ? '/franchise/' : '/iletisim/', request.url), 303);
  }

  const veri = Object.fromEntries(await request.formData());

  // bal tuzağı: gerçek kullanıcı bu alanı doldurmaz
  if (veri.website) return sayfa('Teşekkürler', '<h1>Teşekkürler</h1><p>Mesajınız alındı.</p>');

  // TODO: Airtable bağlanınca kayıt burada yapılacak ve /tesekkurler/ sayfasına yönlendirilecek.
  if (!env.AIRTABLE_TOKEN) {
    return sayfa(
      'Form henüz açık değil',
      `<h1>Form gönderimi henüz açık değil</h1>
       <p>Bu bölümün altyapısı hazırlanıyor, bu yüzden mesajınızı <strong>kaydedemedik</strong>.
       Size yanlış bir "gönderildi" mesajı göstermek istemedik.</p>
       <p>Bize telefonla ya da WhatsApp'tan ulaşabilirsiniz, hemen dönüş yapalım.</p>`,
      503
    );
  }

  return sayfa('Teşekkürler', '<h1>Teşekkürler</h1><p>Mesajınız bize ulaştı.</p>');
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/iletisim' || url.pathname === '/api/franchise') {
      return formuIsle(request, env, url.pathname);
    }

    if (url.pathname === '/api/cerez') {
      // TODO: çerez onayı ve Google Analytics ara katmanı bu adımda devreye girecek.
      return sayfa(
        'Çerez tercihi',
        `<h1>Çerez tercihi henüz devrede değil</h1>
         <p>Site şu anda hiçbir analitik çerez kullanmıyor, bu yüzden değiştirilecek bir tercih yok.
         Google Analytics eklendiğinde bu sayfa çalışır hâle gelecek.</p>`,
        503
      );
    }

    return env.ASSETS.fetch(request);
  },
};
