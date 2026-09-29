/**
 * Cloudflare Worker: statik dosyaları sunar, /api/ altındaki istekleri karşılar.
 *
 * Çerez onayı burada yönetilir:
 *   - Ziyaretçi onay vermediyse sayfaya HİÇBİR betik eklenmez (sıfır JS).
 *   - "Kabul et" derse cerez_onay çerezi yazılır ve sayfaya Google Analytics eklenir.
 *   - "Reddet" derse karar saklanır, GA çerezleri silinir, banner bir daha gösterilmez.
 *   - GA_ID tanımlı değilse banner hiç gösterilmez (ortada onaylanacak bir şey yoktur).
 *
 * GA_ID'yi ayarlamak için:  npx wrangler secret put GA_ID
 */

const CEREZ = 'cerez_onay';
const YIL = 60 * 60 * 24 * 365;

const TELEFON = '0535 397 30 82';
const TELEFON_HAM = '+905353973082';

// ---------------------------------------------------------------- yardımcılar

function cerezOku(request, ad) {
  const ham = request.headers.get('cookie') ?? '';
  for (const parca of ham.split(';')) {
    const [k, ...v] = parca.trim().split('=');
    if (k === ad) return decodeURIComponent(v.join('='));
  }
  return null;
}

/** Açık yönlendirme olmaması için yalnızca kendi sitemizdeki yollara dönüyoruz. */
function guvenliYol(aday, varsayilan = '/') {
  if (typeof aday !== 'string') return varsayilan;
  if (!aday.startsWith('/') || aday.startsWith('//')) return varsayilan;
  return aday;
}

const bilgiSayfasi = (baslik, govde, durum = 200) =>
  new Response(
    `<!DOCTYPE html><html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${baslik} · Time Fried Chicken</title>
<meta name="robots" content="noindex">
<style>
:root{--kirmizi:#e7272d;--koyu:#1a1d21;--cizgi:#e6e2da}
*{box-sizing:border-box}
body{margin:0;min-height:100vh;display:grid;place-items:center;padding:24px;
font:17px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;color:#1f1f1f;background:#fff8ee}
.kutu{max-width:560px;background:#fff;border:1px solid var(--cizgi);border-radius:18px;
padding:34px 30px;box-shadow:0 6px 20px rgba(34,40,49,.1);text-align:center}
h1{font-size:1.5rem;margin:0 0 .5em;line-height:1.2}p{margin:0 0 1em;color:#33373d}
.dugmeler{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:22px}
a.dugme{display:inline-flex;gap:.5em;padding:.8em 1.5em;border-radius:999px;font-weight:700;
text-decoration:none;border:2px solid transparent}
.birincil{background:var(--kirmizi);color:#fff}.ikincil{border-color:var(--koyu);color:var(--koyu)}
</style></head><body><main class="kutu">${govde}
<div class="dugmeler">
<a class="dugme birincil" href="tel:${TELEFON_HAM}">${TELEFON}</a>
<a class="dugme ikincil" href="/">Ana sayfa</a>
</div></main></body></html>`,
    { status: durum, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } }
  );

// ---------------------------------------------------------------- /api/cerez

function cerezKarari(request, url) {
  if (request.method !== 'POST') {
    return Response.redirect(new URL('/cerez-tercihi/', url), 303);
  }

  return request.formData().then((form) => {
    const karar = form.get('karar') === 'kabul' ? 'kabul' : 'ret';
    const donus = guvenliYol(
      form.get('donus') || (request.headers.get('referer') ? new URL(request.headers.get('referer')).pathname : '/')
    );

    const basliklar = new Headers({ Location: donus, 'Cache-Control': 'no-store' });
    basliklar.append(
      'Set-Cookie',
      `${CEREZ}=${karar}; Path=/; Max-Age=${YIL}; SameSite=Lax; Secure; HttpOnly`
    );

    // Onay geri çekilirse Google Analytics'in yazdığı çerezleri de temizliyoruz.
    if (karar === 'ret') {
      const alan = url.hostname;
      for (const ad of ['_ga', `_ga_${(request.cf?.gaId ?? '')}`]) {
        if (!ad || ad === '_ga_') continue;
        basliklar.append('Set-Cookie', `${ad}=; Path=/; Max-Age=0; SameSite=Lax`);
        basliklar.append('Set-Cookie', `${ad}=; Path=/; Domain=.${alan}; Max-Age=0; SameSite=Lax`);
      }
      basliklar.append('Set-Cookie', `_ga=; Path=/; Domain=.${alan}; Max-Age=0; SameSite=Lax`);
    }

    return new Response(null, { status: 303, headers: basliklar });
  });
}

// ---------------------------------------------------------------- formlar

async function formuIsle(request, env, yol) {
  if (request.method !== 'POST') {
    return Response.redirect(new URL(yol === '/api/franchise' ? '/franchise/' : '/iletisim/', request.url), 303);
  }

  const veri = Object.fromEntries(await request.formData());

  // bal tuzağı: gerçek kullanıcı bu alanı doldurmaz
  if (veri.website) return bilgiSayfasi('Teşekkürler', '<h1>Teşekkürler</h1><p>Mesajınız alındı.</p>');

  // TODO: Airtable bağlanınca kayıt burada yapılacak, ardından /tesekkurler/ sayfasına yönlendirilecek.
  if (!env.AIRTABLE_TOKEN) {
    return bilgiSayfasi(
      'Form henüz açık değil',
      `<h1>Form gönderimi henüz açık değil</h1>
       <p>Bu bölümün altyapısı hazırlanıyor, bu yüzden mesajınızı <strong>kaydedemedik</strong>.
       Size yanlış bir "gönderildi" mesajı göstermek istemedik.</p>
       <p>Bize telefonla ya da WhatsApp'tan ulaşabilirsiniz, hemen dönüş yapalım.</p>`,
      503
    );
  }

  return bilgiSayfasi('Teşekkürler', '<h1>Teşekkürler</h1><p>Mesajınız bize ulaştı.</p>');
}

// ---------------------------------------------------------------- HTML işleme

const DURUM_METNI = {
  kabul: 'Şu anki tercihiniz: istatistik çerezlerine izin verdiniz.',
  ret: 'Şu anki tercihiniz: istatistik çerezlerini reddettiniz. Sitede hiçbir analitik çerez çalışmıyor.',
  yok: 'Henüz bir tercih belirtmediniz. Bu durumda da hiçbir analitik çerez çalışmaz.',
};

class BlokSil {
  element(el) { el.remove(); }
}

class MetinYaz {
  constructor(metin) { this.metin = metin; }
  element(el) { el.setInnerContent(this.metin); }
}

class AnalyticsEkle {
  constructor(gaId, nonce) { this.gaId = gaId; this.nonce = nonce; }
  element(el) {
    el.append(
      `<script async src="https://www.googletagmanager.com/gtag/js?id=${this.gaId}"></script>` +
      `<script nonce="${this.nonce}">window.dataLayer=window.dataLayer||[];` +
      `function gtag(){dataLayer.push(arguments)}gtag('js',new Date());` +
      `gtag('config','${this.gaId}',{anonymize_ip:true});</script>`,
      { html: true }
    );
  }
}

function cspYaz(mevcut, nonce) {
  // Yalnızca onay veren ziyaretçinin yanıtında betik kaynaklarına izin veriyoruz.
  return (mevcut ?? "default-src 'none'")
    .replace("default-src 'none'", "default-src 'none'; script-src 'self' 'nonce-" + nonce + "' https://www.googletagmanager.com; connect-src https://*.google-analytics.com https://*.analytics.google.com; img-src 'self' data: https://*.google-analytics.com");
}

// ---------------------------------------------------------------- giriş

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/cerez') return cerezKarari(request, url);
    if (url.pathname === '/api/iletisim' || url.pathname === '/api/franchise') {
      return formuIsle(request, env, url.pathname);
    }

    const yanit = await env.ASSETS.fetch(request);
    const tur = yanit.headers.get('content-type') ?? '';
    if (!tur.includes('text/html')) return yanit;

    const karar = cerezOku(request, CEREZ);            // 'kabul' | 'ret' | null
    const analitikVar = Boolean(env.GA_ID);
    const onayli = analitikVar && karar === 'kabul';
    const bannerGoster = analitikVar && karar === null;

    let cikti = new HTMLRewriter()
      .on('#cerez-durum', new MetinYaz(analitikVar ? DURUM_METNI[karar ?? 'yok'] : DURUM_METNI.yok));

    if (!bannerGoster) cikti = cikti.on('#cerez-banner', new BlokSil());

    let sonuc;
    if (onayli) {
      const nonce = crypto.randomUUID().replaceAll('-', '');
      sonuc = cikti.on('head', new AnalyticsEkle(env.GA_ID, nonce)).transform(yanit);
      const basliklar = new Headers(sonuc.headers);
      basliklar.set('Content-Security-Policy', cspYaz(basliklar.get('Content-Security-Policy'), nonce));
      basliklar.set('Cache-Control', 'private, no-store');
      sonuc = new Response(sonuc.body, { status: sonuc.status, headers: basliklar });
    } else {
      sonuc = cikti.transform(yanit);
    }

    return sonuc;
  },
};
