#!/usr/bin/env node
/**
 * Instagram Image Scraper for Ana Bernal's Portfolio
 *
 * This script uses Puppeteer to scrape images from @anabernal.moda's
 * Instagram profile and download them to the project's public/images directory.
 *
 * Usage:
 *   1. npm install puppeteer (if not installed)
 *   2. node scripts/download-instagram.mjs
 *
 * Note: You need to be logged into Instagram in Chrome for this to work.
 * The script will use your existing Chrome profile.
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import https from 'https';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'instagram');
// Perfil dedicado y PERSISTENTE: te logueás a Instagram una sola vez aquí y la
// sesión queda guardada para las próximas corridas. (gitignored)
const PROFILE_DIR = path.join(__dirname, '.ig-session');
const PROFILE_URL = 'https://www.instagram.com/anabernal.moda/';
const MAX_POSTS = 60;
const SCROLL_DELAY = 2000;

function waitForEnter(message) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(`${message}\n`, () => {
      rl.close();
      resolve();
    });
  });
}

async function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
      if (response.statusCode === 301 || response.statusCode === 302) {
        downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
        return;
      }
      response.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlink(filepath, () => {}); reject(err); });
  });
}

async function main() {
  // Create output directory
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('🚀 Launching Chrome (perfil dedicado en scripts/.ig-session)...');

  // Usa el Chrome instalado del sistema + un perfil persistente propio.
  // No toca tu perfil normal de Chrome (no hace falta cerrar Chrome).
  const browser = await puppeteer.launch({
    headless: false,
    channel: 'chrome', // usa tu Google Chrome instalado, no descarga Chromium
    userDataDir: PROFILE_DIR,
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
  });

  const page = (await browser.pages())[0] ?? (await browser.newPage());

  // ── Login gate ──────────────────────────────────────────────────────────
  // La 1ra vez: iniciás sesión a mano en la ventana que se abre. Después la
  // sesión queda guardada en .ig-session/ y este paso se saltea solo.
  console.log('🔓 Verificando sesión de Instagram...');
  await page.goto('https://www.instagram.com/', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });
  const loggedIn = await page.evaluate(
    () => !document.querySelector('input[name="username"]'),
  );
  if (!loggedIn) {
    console.log(
      '\n🔐 No hay sesión. Iniciá sesión en Instagram EN LA VENTANA que se abrió.',
    );
    await waitForEnter(
      '   Cuando ya estés logueado, volvé a esta terminal y presioná ENTER…',
    );
  } else {
    console.log('✅ Sesión activa (guardada de una corrida previa).');
  }

  console.log(`📱 Navigating to ${PROFILE_URL}`);
  await page.goto(PROFILE_URL, { waitUntil: 'networkidle2', timeout: 30000 });

  // Wait for posts to load
  await page.waitForSelector('article a[href*="/p/"], main a[href*="/p/"]', {
    timeout: 20000,
  });
  console.log('✅ Profile loaded');

  // Scroll to load all posts
  let prevPostCount = 0;
  let scrollAttempts = 0;
  const maxScrollAttempts = 30;

  while (scrollAttempts < maxScrollAttempts) {
    const postLinks = await page.$$eval('article a[href*="/p/"]', links =>
      [...new Set(links.map(a => a.href))]
    );

    console.log(`📜 Found ${postLinks.length} posts so far...`);

    if (postLinks.length >= MAX_POSTS || postLinks.length === prevPostCount) {
      break;
    }

    prevPostCount = postLinks.length;
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await new Promise(r => setTimeout(r, SCROLL_DELAY));
    scrollAttempts++;
  }

  // Collect all post URLs
  const postUrls = await page.$$eval('article a[href*="/p/"]', links =>
    [...new Set(links.map(a => a.href))]
  );

  console.log(`\n📸 Found ${postUrls.length} total posts. Downloading images...\n`);

  // Visit each post and download images
  let downloaded = 0;
  const manifest = [];

  for (let i = 0; i < Math.min(postUrls.length, MAX_POSTS); i++) {
    const postUrl = postUrls[i];
    const shortcode = postUrl.match(/\/p\/([^/]+)/)?.[1] || `post-${i}`;

    try {
      await page.goto(postUrl, { waitUntil: 'networkidle2', timeout: 15000 });
      await new Promise(r => setTimeout(r, 1000));

      // Get all images in the post (carousel support)
      const images = await page.evaluate(() => {
        const imgs = document.querySelectorAll('article img[srcset], article img[src*="instagram"]');
        return Array.from(imgs)
          .filter(img => img.naturalWidth > 200)
          .map(img => {
            // Get highest resolution from srcset if available
            if (img.srcset) {
              const sources = img.srcset.split(',').map(s => {
                const parts = s.trim().split(' ');
                return { url: parts[0], width: parseInt(parts[1]) || 0 };
              });
              sources.sort((a, b) => b.width - a.width);
              return sources[0]?.url || img.src;
            }
            return img.src;
          });
      });

      // Download each image in the post
      for (let j = 0; j < images.length; j++) {
        const filename = images.length > 1
          ? `${shortcode}_${j + 1}.jpg`
          : `${shortcode}.jpg`;
        const filepath = path.join(OUTPUT_DIR, filename);

        try {
          await downloadImage(images[j], filepath);
          downloaded++;
          manifest.push({ shortcode, filename, url: postUrl, index: j });
          console.log(`  ✅ [${downloaded}] ${filename}`);
        } catch (err) {
          console.log(`  ❌ Failed: ${filename} - ${err.message}`);
        }
      }

      // Also try to get caption/alt text for metadata
      const caption = await page.evaluate(() => {
        const el = document.querySelector('article h1, article span[dir="auto"]');
        return el?.textContent?.substring(0, 200) || '';
      });

      if (manifest.length > 0) {
        manifest[manifest.length - 1].caption = caption;
      }

    } catch (err) {
      console.log(`  ⚠️  Skipped ${shortcode}: ${err.message}`);
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 500));
  }

  // Save manifest
  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n🎉 Done! Downloaded ${downloaded} images to ${OUTPUT_DIR}`);
  console.log(`📋 Manifest saved to ${manifestPath}`);

  await browser.close();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
