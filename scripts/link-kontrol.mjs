// Üretilen sayfalardaki iç linkleri tarar, karşılığı olmayan varsa uyarır.
import { readdir, readFile, stat } from 'node:fs/promises';
import { join } from 'node:path';

const DIST = 'dist';
const sayfalar = [];
const kirik = [];

async function tara(dizin) {
  for (const oge of await readdir(dizin, { withFileTypes: true })) {
    const yol = join(dizin, oge.name);
    if (oge.isDirectory()) await tara(yol);
    else if (oge.name.endsWith('.html')) sayfalar.push(yol);
  }
}
const varMi = async (p) => { try { await stat(p); return true; } catch { return false; } };

await tara(DIST);
for (const s of sayfalar) {
  const html = await readFile(s, 'utf8');
  for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)) {
    const yol = m[1];
    const hedef = yol.endsWith('/') ? join(DIST, yol, 'index.html') : join(DIST, yol);
    if (!(await varMi(hedef))) kirik.push(`${s.replace(DIST, '')} → ${yol}`);
  }
}

const benzersiz = [...new Set(kirik)];
if (benzersiz.length) {
  console.error('[link-kontrol] Karşılığı olmayan linkler:\n  - ' + benzersiz.join('\n  - '));
  process.exit(1);
}
console.log(`[link-kontrol] Tamam: ${sayfalar.length} sayfadaki iç linklerin hepsi çalışıyor.`);
