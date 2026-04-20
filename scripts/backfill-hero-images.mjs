import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

const UNSPLASH_KEY = 'x2RTqX8NqZPeD8_-AzvysFqpERpgnEHLVH8qMeSmhU0';
const BLOG_DIR = 'C:/Users/jense/Projects/my-site/src/content/blog';

function extractTitle(content) {
  const match = content.match(/^title:\s*["']?(.+?)["']?\s*$/m);
  return match ? match[1] : null;
}

function hasHeroImage(content) {
  return /^heroImage:/m.test(content);
}

function insertHeroImage(content, url) {
  // Handle both LF and CRLF line endings
  return content.replace(/^draft: false\r?\n---/m, `draft: false\r\nheroImage: "${url}"\r\n---`);
}

async function fetchRandomImage(title) {
  const query = encodeURIComponent(title);
  const url = `https://api.unsplash.com/photos/random?query=${query}&orientation=landscape&client_id=${UNSPLASH_KEY}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Unsplash error ${res.status} for "${title}"`);
  const data = await res.json();
  return data.urls?.regular || null;
}

const files = readdirSync(BLOG_DIR).filter(f => f.endsWith('.md'));
const toBackfill = files.filter(f => !hasHeroImage(readFileSync(join(BLOG_DIR, f), 'utf8')));

console.log(`Found ${toBackfill.length} posts without heroImage:\n`);

for (const file of toBackfill) {
  const path = join(BLOG_DIR, file);
  const content = readFileSync(path, 'utf8');
  const title = extractTitle(content);

  if (!title) {
    console.log(`  SKIP  ${file} — could not parse title`);
    continue;
  }

  try {
    const imageUrl = await fetchRandomImage(title);
    if (!imageUrl) {
      console.log(`  SKIP  ${file} — no image returned`);
      continue;
    }
    const updated = insertHeroImage(content, imageUrl);
    writeFileSync(path, updated, 'utf8');
    console.log(`  OK    ${file}\n        ${imageUrl}\n`);
  } catch (err) {
    console.log(`  ERROR ${file} — ${err.message}`);
  }

  // Respect Unsplash rate limits
  await new Promise(r => setTimeout(r, 300));
}

console.log('Done.');
