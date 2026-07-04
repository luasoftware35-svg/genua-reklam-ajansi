import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient } from '@supabase/supabase-js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dirname, '../.env.local');
const env = Object.fromEntries(
  readFileSync(envPath, 'utf8')
    .split('\n')
    .filter((line) => line.includes('=') && !line.trim().startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index), line.slice(index + 1)];
    }),
);

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SECRET_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } },
);

const USERNAME = process.argv[2] || 'mrrumutt2';

function fetchClipsFromInstagram(username) {
  const script = `
import json, urllib.request, time
username = ${JSON.stringify(username)}
headers = {'X-IG-App-ID': '936619743392459', 'User-Agent': 'Mozilla/5.0'}

def fetch(url):
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.load(r)

profile = fetch(f'https://www.instagram.com/api/v1/users/web_profile_info/?username={username}')
user_id = profile['data']['user']['id']
clips = []
max_id = None
while True:
    url = f'https://www.instagram.com/api/v1/feed/user/{user_id}/?count=50'
    if max_id:
        url += f'&max_id={max_id}'
    data = fetch(url)
    for item in data.get('items', []):
        if item.get('product_type') == 'clips' and item.get('code'):
            cap = (item.get('caption') or {}).get('text', '')
            thumb = None
            cands = (item.get('image_versions2') or {}).get('candidates') or []
            if cands:
                thumb = cands[0].get('url')
            clips.append({'code': item['code'], 'caption': cap, 'thumbnail_url': thumb})
    if not data.get('more_available') or not data.get('next_max_id'):
        break
    max_id = data['next_max_id']
    time.sleep(0.25)
print(json.dumps(clips, ensure_ascii=False))
`;

  const output = execFileSync('python3', ['-c', script], { encoding: 'utf8' });
  return JSON.parse(output);
}

function firstLine(text) {
  return String(text || '')
    .split('\n')[0]
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 120);
}

async function main() {
  console.log(`@${USERNAME} reel'leri alınıyor...`);
  const clips = fetchClipsFromInstagram(USERNAME);
  console.log(`${clips.length} reel bulundu.`);

  const { data: existingRows, error: readError } = await supabase
    .from('instagram_reels')
    .select('reel_url');
  if (readError) throw readError;

  const existing = new Set((existingRows ?? []).map((row) => row.reel_url?.replace(/\/$/, '')));
  let inserted = 0;
  let updated = 0;

  for (const [index, item] of clips.entries()) {
    const reelUrl = `https://www.instagram.com/reel/${item.code}/`;
    const title = firstLine(item.caption) || `Reel ${item.code}`;
    const payload = {
      title,
      client_name: 'Umut Avcı',
      reel_url: reelUrl,
      thumbnail_url: item.thumbnail_url,
      display_order: index + 1,
      is_active: true,
    };

    if (existing.has(reelUrl.replace(/\/$/, ''))) {
      const { error } = await supabase.from('instagram_reels').update(payload).eq('reel_url', reelUrl);
      if (error) {
        console.error(`! Güncellenemedi ${reelUrl}:`, error.message);
        continue;
      }
      updated += 1;
      console.log(`↻ ${title}`);
      continue;
    }

    const { error } = await supabase.from('instagram_reels').insert(payload);
    if (error) {
      console.error(`! Eklenemedi ${reelUrl}:`, error.message);
      continue;
    }
    inserted += 1;
    console.log(`✓ ${title}`);
  }

  console.log(`Bitti. ${inserted} yeni, ${updated} güncellendi.`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
