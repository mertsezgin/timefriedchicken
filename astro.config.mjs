// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ornek.com.tr',   // alan adı alınınca burası güncellenecek
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
