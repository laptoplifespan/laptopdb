/**
 * Put an exported backup back into a Supabase project.
 *
 * Pairs with scripts/export-supabase-backup.mjs. Use it to repopulate this
 * project after restoring it, or to move the data into a brand-new project.
 *
 * Writing needs the SERVICE ROLE key (the public key is read-only), which you
 * copy from the target project's dashboard under Settings -> API. Never commit
 * it or put it in a page — it bypasses all access rules.
 *
 * Usage:
 *   node scripts/restore-supabase-backup.mjs --dry-run      # check the files, write nothing
 *   NEXT_PUBLIC_SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
 *     node scripts/restore-supabase-backup.mjs
 *
 * Rows are matched on their existing id, so re-running is safe: it updates rows
 * that are already there rather than creating duplicates.
 */

import { readFile } from 'node:fs/promises'

// Parents before children: configurations and compatibility point at the others.
const TABLES = ['laptops', 'operating_systems', 'configurations', 'compatibility']
const BATCH = 500
const IN_DIR = new URL('../backup/', import.meta.url)

const dryRun = process.argv.includes('--dry-run')
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!dryRun && (!url || !key)) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, or pass --dry-run.')
  process.exit(1)
}

async function readTable(table) {
  const rows = JSON.parse(await readFile(new URL(`${table}.json`, IN_DIR), 'utf8'))
  if (!Array.isArray(rows)) throw new Error('file is not a list of rows')
  return rows
}

async function upsert(table, rows) {
  for (let i = 0; i < rows.length; i += BATCH) {
    const batch = rows.slice(i, i + BATCH)
    const res = await fetch(`${url}/rest/v1/${table}`, {
      method: 'POST',
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      },
      body: JSON.stringify(batch),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status} ${(await res.text()).slice(0, 300)}`)
    process.stdout.write(`  ${table}: ${Math.min(i + BATCH, rows.length)}/${rows.length}\r`)
  }
}

for (const table of TABLES) {
  try {
    const rows = await readTable(table)
    if (dryRun) {
      const columns = rows.length ? Object.keys(rows[0]).length : 0
      console.log(`  ${table.padEnd(20)} ${String(rows.length).padStart(6)} rows, ${columns} columns — file OK`)
      continue
    }
    await upsert(table, rows)
    console.log(`  ${table.padEnd(20)} ${String(rows.length).padStart(6)} rows restored`)
  } catch (err) {
    console.error(`  ${table.padEnd(20)} FAILED — ${err.message}`)
    process.exit(1)
  }
}

console.log(dryRun ? '\ndry run only — nothing was written' : '\nrestore complete')
