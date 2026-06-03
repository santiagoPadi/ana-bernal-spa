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
  // Fuente de verdad: la cookie `sessionid` (sólo existe si estás logueado).
  // La 1ra vez te logueás a mano en la ventana; después queda guardada en
  // .ig-session/ y este paso se saltea solo.
  console.log('🔓 Verificando sesión de Instagram...');
  await page.goto('https://www.instagram.com/', {
    waitUntil: 'networkidle2',
    timeout: 60000,
  });

  const hasSession = async () => {
    // sessionid es httpOnly → no aparece en document.cookie; hay que usar la API
    // de cookies. browser.cookies() en puppeteer v23+, page.cookies() en versiones
    // anteriores.
    let cookies = [];
    try {
      cookies =
        typeof browser.cookies === 'function'
          ? await browser.cookies()
          : await page.cookies('https://www.instagram.com');
    } catch {
      cookies = await page.cookies('https://www.instagram.com');
    }
    return cookies.some((c) => c.name === 'sessionid' && c.value);
  };

  if (await hasSession()) {
    console.log('✅ Sesión activa (guardada de una corrida previa).');
  } else {
    console.log(
      '\n🔐 No hay sesión iniciada. Iniciá sesión en Instagram EN LA VENTANA que se abrió.',
    );
    // Loop: no avanza hasta detectar la cookie sessionid de verdad.
    // (no descarga nada hasta que estés logueado)
    for (;;) {
      await waitForEnter(
        '   Cuando YA estés logueado en la ventana, presioná ENTER aquí…',
      );
      if (await hasSession()) {
        console.log('✅ Sesión detectada.');
        break;
      }
      console.log(
        '   ⚠️  Todavía no detecto la sesión. Asegurate de completar el login y reintentá.',
      );
    }
  }

  console.log(`📱 Navigating to ${PROFILE_URL}`);
  // domcontentloaded (NO networkidle2): Instagram nunca queda "idle" por su
  // polling en segundo plano; networkidle2 tiraba timeout y cerraba todo.
  await page.goto(PROFILE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  try {
    await page.waitForSelector('a[href*="/p/"]', { timeout: 30000 });
  } catch {
    console.log('⚠️  No aparecieron posts en 30s (¿sesión/perfil?). Sigo igual.');
  }
  await new Promise((r) => setTimeout(r, 1500));
  console.log('✅ Profile loaded');

  // ── Recolección desde el GRID (sin entrar a cada post: más robusto) ──────
  // De cada tile del grid sacamos {shortcode, mejor URL del srcset (1080/1440px)}.
  const collected = new Map(); // shortcode -> url
  let stale = 0;
  for (let attempt = 0; attempt < 40 && collected.size < MAX_POSTS && stale < 4; attempt++) {
    const batch = await page.$$eval('a[href*="/p/"]', (links) =>
      links
        .map((a) => {
          const m = a.getAttribute('href').match(/\/p\/([^/]+)/);
          if (!m) return null;
          const img = a.querySelector('img');
          if (!img) return null;
          let url = img.src;
          if (img.srcset) {
            const best = img.srcset
              .split(',')
              .map((s) => s.trim().split(' '))
              .sort((x, y) => (parseInt(y[1]) || 0) - (parseInt(x[1]) || 0))[0];
            if (best) url = best[0];
          }
          return { code: m[1], url };
        })
        .filter(Boolean),
    );
    const before = collected.size;
    for (const { code, url } of batch) if (!collected.has(code)) collected.set(code, url);
    console.log(`📜 ${collected.size} posts recolectados...`);
    stale = collected.size === before ? stale + 1 : 0;
    await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
    await new Promise((r) => setTimeout(r, SCROLL_DELAY));
  }

  console.log(
    `\n📸 ${collected.size} posts en el grid. Descargando los que faltan...\n`,
  );

  // ── Descarga con DEDUP: salta los ig-<code>.jpg que ya existen ───────────
  let downloaded = 0;
  let skipped = 0;
  const manifest = [];
  const nuevos = [];
  for (const [code, url] of collected) {
    const filename = `ig-${code}.jpg`;
    const filepath = path.join(OUTPUT_DIR, filename);
    if (fs.existsSync(filepath)) {
      skipped++;
      continue;
    }
    try {
      await downloadImage(url, filepath);
      downloaded++;
      nuevos.push(filename);
      manifest.push({ shortcode: code, filename, url });
      console.log(`  ✅ [${downloaded}] ${filename}`);
    } catch (err) {
      console.log(`  ❌ ${filename}: ${err.message}`);
    }
    await new Promise((r) => setTimeout(r, 300));
  }

  const manifestPath = path.join(OUTPUT_DIR, 'manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(
    `\n🎉 Listo. Nuevas: ${downloaded} · Ya existían: ${skipped} · Total grid: ${collected.size}`,
  );
  if (nuevos.length) {
    console.log('\n🆕 Archivos nuevos:');
    nuevos.forEach((f) => console.log('   ' + f));
    console.log('\n👉 Pasale esta lista a Claude (o decile "ya está").');
  } else {
    console.log('   No había posts nuevos respecto a los ya descargados.');
  }

  await browser.close();
}

main().catch(async (err) => {
  console.error('\n❌ Error:', err && err.stack ? err.stack : err);
  console.error('   (La ventana queda abierta para que veas en qué quedó.)');
  try {
    await waitForEnter('   Presioná ENTER para cerrar…');
  } catch {
    /* noop */
  }
  process.exit(1);
});
