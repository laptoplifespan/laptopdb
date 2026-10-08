/**
 * Export every table to JSON files you keep on your own computer.
 *
 * Supabase's Pro backups are "physical" — they can only be restored in place,
 * never downloaded — and deleting a project destroys them along with it. So
 * before pausing or deleting this project, run this to hold your own copy.
 *
 * Writes backup/<table>.json. Restore with scripts/restore-supabase-backup.mjs.
 *
 * Usage:  node --env-file=.env.local scripts/export-supabase-backup.mjs
 */

import { mkdir, writeFile } from 'node:fs/promises'

// Parents first: configurations and compatibility reference the others, so this
// is also the order a restore has to insert them in.
const TABLES = ['laptops', 'operating_systems', 'configurations', 'compatibility']
const PAGE = 1000
const OUT_DIR = new URL('../backup/', import.meta.url)

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!url || !key) {
  console.error('Missing Supabase settings. Run with:  node --env-file=.env.local scripts/export-supabase-backup.mjs')
  process.exit(1)
}
const headers = { apikey: key, Authorization: `Bearer ${key}` }

/** Every row of one table, a page at a time. */
async function fetchTable(table) {
  const rows = []
  for (let from = 0; ; from += PAGE) {
    const res = await fetch(`${url}/rest/v1/${table}?select=*`, {
      headers: { ...headers, Range: `${from}-${from + PAGE - 1}` },
    })
    if (!res.ok) throw new Error(`${table}: HTTP ${res.status} ${(await res.text()).slice(0, 200)}`)
    const page = await res.json()
    rows.push(...page)
    if (page.length < PAGE) return rows
  }
}

await mkdir(OUT_DIR, { recursive: true })
const summary = []
for (const table of TABLES) {
  try {
    const rows = await fetchTable(table)
    await writeFile(new URL(`${table}.json`, OUT_DIR), JSON.stringify(rows, null, 2))
    summary.push(`  ${table.padEnd(20)} ${String(rows.length).padStart(6)} rows`)
  } catch (err) {
    summary.push(`  ${table.padEnd(20)} FAILED — ${err.message}`)
  }
}

await writeFile(
  new URL('exported-at.txt', OUT_DIR),
  `Exported ${new Date().toISOString()} from ${url}\nTables: ${TABLES.join(', ')}\n`,
)

console.log('backup written to backup/\n' + summary.join('\n'))
console.log('\nKeep a copy somewhere off this machine (cloud drive or USB).')
