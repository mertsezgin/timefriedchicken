// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Canlı adres. Önizleme dağıtımlarında SITE_URL ortam değişkeniyle geçici olarak değiştirilebilir.
  site: process.env.SITE_URL ?? 'https://timefriedchicken.com',
  output: 'static',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'always',  // CSS HTML içine gömülür: render'ı bloklayan istek kalmaz
    format: 'directory',
  },
  compressHTML: true,
  devToolbar: { enabled: false }, // geliştirme çubuğu tarayıcıya JS yüklüyor
});
