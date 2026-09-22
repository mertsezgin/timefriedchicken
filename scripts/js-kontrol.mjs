// Derleme sonrası kontrol: üretilen sayfalarda JavaScript var mı?
// Sıfır JS kuralını iyi niyete değil otomatik denetime bağlar.
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const bulunan = [];

async function tara(dizin) {
  for (const oge of await readdir(dizin, { withFileTypes: true })) {
    const yol = join(dizin, oge.name);
    if (oge.isDirectory()) await tara(yol);
    else if (oge.name.endsWith('.html')) {
      const icerik = await readFile(yol, 'utf8');
      const betikler = icerik.match(/<script\b[^>]*>/gi) ?? [];
      // application/ld+json yapılandırılmış veridir, çalıştırılabilir kod değildir
      const calisan = betikler.filter((b) => !/type=["']application\/ld\+json["']/i.test(b));
      if (calisan.length) bulunan.push(`${yol}: ${calisan.join(' ')}`);
    } else if (oge.name.endsWith('.js') || oge.name.endsWith('.mjs')) {
      bulunan.push(`${yol}: tarayıcıya JS dosyası gönderiliyor`);
    }
  }
}

await tara(DIST);

if (bulunan.length) {
  console.error('\n[js-kontrol] Sıfır JS kuralı bozuldu:\n  - ' + bulunan.join('\n  - ') + '\n');
  process.exit(1);
}
console.log('[js-kontrol] Tamam: üretilen sayfalarda çalıştırılabilir JavaScript yok.');
