/**
 * Masa karekodunu üretir ve gerçekten okunduğunu doğrular.
 *
 *   node scripts/qr-uret.mjs
 *
 * Çıktılar qr/ klasörüne yazılır:
 *   qr-sade.svg      → baskı için vektör (siyah/beyaz)
 *   qr-logolu.svg    → ortasında marka işareti olan sürüm
 *   qr-*.png         → kontrol amaçlı 1200 px görüntüler
 *
 * Adres /qr olarak sabit: menü düzeni değişse bile basılı karekod geçerli kalır.
 */
import QRCode from 'qrcode';
import jsQR from 'jsqr';
import sharp from 'sharp';
import { readFile, writeFile, mkdir } from 'node:fs/promises';

const ADRES = process.env.QR_URL ?? 'https://timefriedchicken.com/qr';
const CIKTI = 'qr';

// Hata düzeltme seviyesi H: karekodun %30'u okunamasa bile çalışır.
// Ortadaki logo bu sayede sorun çıkarmıyor.
const AYAR = { errorCorrectionLevel: 'H', margin: 2, color: { dark: '#1a1d21', light: '#ffffff' } };

async function dogrula(pngBuffer, etiket) {
  const { data, info } = await sharp(pngBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const okunan = jsQR(new Uint8ClampedArray(data), info.width, info.height);
  if (!okunan) throw new Error(`${etiket}: karekod okunamadı`);
  if (okunan.data !== ADRES) throw new Error(`${etiket}: yanlış adres okundu → ${okunan.data}`);
  console.log(`  ${etiket}: okundu → ${okunan.data}`);
}

await mkdir(CIKTI, { recursive: true });
console.log(`Karekod adresi: ${ADRES}\n`);

// --- 1. sade sürüm ---
const sadeSvg = await QRCode.toString(ADRES, { ...AYAR, type: 'svg', width: 1200 });
await writeFile(`${CIKTI}/qr-sade.svg`, sadeSvg);
const sadePng = await QRCode.toBuffer(ADRES, { ...AYAR, type: 'png', width: 1200 });
await writeFile(`${CIKTI}/qr-sade.png`, sadePng);
await dogrula(sadePng, 'sade');

// --- 2. logolu sürüm ---
// Marka işaretini karekodun ortasına, beyaz yuvarlak bir alanın içine koyuyoruz.
// işareti yuvarlak kırpıyoruz ki karekodun ortasında kare bir blok gibi durmasın
const yuvarlakMaske = Buffer.from(
  `<svg width="240" height="240"><circle cx="120" cy="120" r="120" fill="#fff"/></svg>`
);
const isaret = await sharp('görsel-raw/Adsız tasarım (1).png')
  .resize(240, 240)
  .composite([{ input: yuvarlakMaske, blend: 'dest-in' }])
  .png()
  .toBuffer();
const isaretB64 = isaret.toString('base64');

const logoluSvg = sadeSvg.replace(
  '</svg>',
  `  <circle cx="50%" cy="50%" r="8.4%" fill="#ffffff"/>
  <image x="43.2%" y="43.2%" width="13.6%" height="13.6%"
         href="data:image/png;base64,${isaretB64}"
         preserveAspectRatio="xMidYMid meet"/>
</svg>`
);
await writeFile(`${CIKTI}/qr-logolu.svg`, logoluSvg);

const logoluPng = await sharp(Buffer.from(logoluSvg)).resize(1200, 1200).png().toBuffer();
await writeFile(`${CIKTI}/qr-logolu.png`, logoluPng);
await dogrula(logoluPng, 'logolu');

// --- 3. zorlu koşul testi: küçük baskı + bozulma ---
// 2 cm'lik baskıyı taklit eden 180 px'lik küçültme ve hafif bulanıklık
const kucuk = await sharp(logoluPng).resize(180, 180).blur(0.6).png().toBuffer();
await dogrula(kucuk, 'logolu (180 px, bulanık)');

console.log('\nTamam. Dosyalar qr/ klasöründe.');
