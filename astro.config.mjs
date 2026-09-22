// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Alan adı alınınca SITE_URL ortam değişkenini ya da buradaki varsayılanı güncelleyin.
  site: process.env.SITE_URL ?? 'https://time-fried-chicken.pages.dev',
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
