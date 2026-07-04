#!/usr/bin/env node
/**
 * Supabase SQL Editor'da migration dosyasını çalıştırın:
 * supabase/migrations/20260704000100_instagram_reels.sql
 *
 * veya: https://supabase.com/dashboard/project/xawqrlillkfjzjxpnjqe/sql/new
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sql = readFileSync(join(__dirname, '../supabase/migrations/20260704000100_instagram_reels.sql'), 'utf8');

console.log('Aşağıdaki SQL\'i Supabase SQL Editor\'a yapıştırıp Run deyin:\n');
console.log(sql);
