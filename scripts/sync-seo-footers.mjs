import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const LOCAL_LINK = '<li><a href="denizli-reklam-ajansi.html">Denizli Reklam Ajansı</a></li>';
const SERVICE_LINKS = [
  '<li><a href="dijital-reklam.html">Dijital Reklam</a></li>',
  '<li><a href="sosyal-medya.html">Sosyal Medya</a></li>',
  '<li><a href="marka-tasarim.html">Marka Tasarımı</a></li>',
  '<li><a href="icerik-uretimi.html">İçerik Üretimi</a></li>',
  '<li><a href="seo.html">SEO</a></li>',
  '<li><a href="web-tasarim.html">Web Tasarım</a></li>',
].join('');

const htmlFiles = readdirSync(root).filter((file) => file.endsWith('.html') && file !== 'index.html');

for (const file of htmlFiles) {
  const filePath = resolve(root, file);
  let html = readFileSync(filePath, 'utf8');
  let changed = false;

  if (html.includes('<h2>Hızlı Linkler</h2>') && !html.includes('href="denizli-reklam-ajansi.html"')) {
    html = html.replace(
      /(<h2>Hızlı Linkler<\/h2>\s*<ul>\s*)/,
      `$1${LOCAL_LINK}\n          `,
    );
    changed = true;
  }

  const servicesBlock = /<h2>Hizmetler<\/h2>\s*<ul>[\s\S]*?<\/ul>/;
  if (servicesBlock.test(html) && !html.includes('href="seo.html"')) {
    html = html.replace(servicesBlock, `<h2>Hizmetler</h2>\n        <ul>\n          ${SERVICE_LINKS}\n        </ul>`);
    changed = true;
  }

  if (changed) {
    writeFileSync(filePath, html, 'utf8');
    console.log('Footer synced:', file);
  }
}

console.log('Footer sync complete.');
