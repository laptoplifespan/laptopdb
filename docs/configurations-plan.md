# Plan: Multiple Configurations per Laptop Model

**Status:** In progress. Decision: **Option B** (per-config compatibility) chosen.
- ✅ **Phase 1 complete** — `configurations` table created; existing 4 laptops migrated to one config each. Site unchanged (laptops columns left intact).
- ✅ **Phase 2 complete** — laptop page reads configs; `SpecsTable` client component shows a config dropdown (only when >1 config).
- ✅ **Phase 3 complete** — admin panel manages multiple configs per laptop via `ConfigManager` + `/api/admin/configurations`. Laptop form trimmed to model-level fields; per-config specs moved to the configurations manager. (Note: the old per-config columns on `laptops` are now unused but left in place; see cleanup note below.)
- ✅ **Phase 4 complete (Option B)** — compatibility moved to per-configuration. `compatibility.configuration_id` added; laptop & OS pages read per-config; compatibility editing now lives inside the configuration editor (`ConfigManager`), replacing the old standalone compatibility tab.

**Last updated:** 2026-06

---

## The problem

Many laptop models (e.g. Dell Latitude 5520) ship in several configurations — different
CPU, RAM, storage, etc. — under a single model name. The current site assumes:

> one laptop = one database row = one fixed set of specs

That can't represent a model with multiple spec options. We want a **dropdown on the
laptop page** to switch between configurations, with the spec table updating to match.

---

## The approach: split "model" from "configuration"

Today everything lives in one `laptops` row. We split it into two levels:

- **Model** — the things shared across all configs:
  `brand, model, slug, year, display_inches, display_resolution, weight_kg,
  description, upgrade_path`
- **Configuration** — the things that vary (a new `configurations` table, many rows per model):
  `cpu, ram_gb, soldered_ram, max_ram_gb, tpm_2_0, storage, gpu`
  plus a label (e.g. "Core i5 / 8GB / 256GB") and a sort order.

A model has one or more configurations. The page shows a dropdown of configs; choosing one
updates the spec table.

---

## Key design decision: where does OS compatibility live?

The two specs that most affect Windows 11 support — **CPU** and **TPM 2.0** — are exactly the
ones that vary between configurations. So compatibility *can* differ per config.

- **Option A (simpler): keep compatibility at the model level.** One set of green/red/gray
  dots for the whole model. Good enough when a model's configs are all similar.
- **Option B (more correct): move compatibility to the config level.** More accurate, but
  multiplies data entry — you'd record compatibility for each config.

**Recommendation:** start with Option A (model level), revisit Option B later only if real
models turn out to vary in compatibility.

---

## Phased plan

### Phase 1 — Foundation (data + migration)
- Create the `configurations` table in Supabase (with a foreign key to `laptops`).
- Decide final list of which columns are "model-level" vs "config-level."
- **Migrate existing laptops:** automatically create one configuration per existing laptop
  from its current specs, so nothing breaks and every model still has at least one config.
- *Outcome:* data is structured for multiple configs; site still looks the same.

### Phase 2 — Laptop page dropdown
- Add a configuration dropdown to `/laptops/[slug]`.
- The spec table updates when a config is selected (requires a small interactive/client
  piece, since the page is currently fully server-rendered — a new pattern for this project).
- Default to the first configuration on load.
- *Outcome:* visitors can switch configs on any model.

### Phase 3 — Admin support
- Extend the admin panel so a laptop can have **multiple configurations** added / edited /
  deleted under it. (This is the largest single piece — meaningfully more UI than the current
  one-laptop-one-form setup.)
- New API routes for configuration create/update/delete, following the existing secured
  pattern (service-role key + password header).
- *Outcome:* you can manage configs without touching SQL.

### Phase 4 (optional, later) — Per-config compatibility
- Only if Option B is wanted: move OS compatibility from model level to config level.
- *Outcome:* accurate Windows 11 (etc.) status per configuration.

---

## What this touches

- **Supabase:** new `configurations` table; data migration; (Phase 4) changes to
  `compatibility`.
- **Pages:** `/laptops/[slug]` gains interactivity; `/laptops` listing likely unchanged
  (still one card per model).
- **Admin:** significant additions for managing configs.
- **API:** new `/api/admin/configurations` routes.

---

## Risks & notes

- **Biggest effort is the admin UI** (Phase 3), not the database or the page.
- **The page becomes interactive.** Introducing a client component is straightforward but new
  for this project; worth doing carefully.
- **Migration must be careful** so existing laptops keep working with zero data loss.
- **Config labels** need a consistent convention (e.g. "i5-1145G7 / 16GB / 512GB") so the
  dropdown is readable.
- Brand-name and slug conventions from the existing project still apply.

---

## Open questions (to finalize before Phase 1)

1. How many configurations does a typical model have — 2–3, or 6–8+? (Affects dropdown vs.
   other UI.)
2. Should shoppers **compare** configs side by side, or just **switch** between them one at a
   time? (Plan currently assumes switch.)
3. Option A or Option B for compatibility to start?
4. Exact split of model-level vs config-level fields — current draft above is the proposal.

---

## Cleanup note (do later, not urgent)

The original per-config columns on the `laptops` table (`cpu, ram_gb, soldered_ram,
max_ram_gb, tpm_2_0, storage, gpu`) are now unused — that data lives in `configurations`.
They're left in place for safety (the page's fallback still reads them if a laptop somehow
has zero configs). Once the new flow is proven in production, these columns can be dropped
to tidy the schema. Don't drop them until then.

Similarly, `compatibility.laptop_id` is now unused (kept nullable so the migration was
reversible and to avoid a deploy-timing gap). It can be dropped once Phase 4 is proven:
`alter table compatibility drop column laptop_id;`

## Rough sizing

Phase 1: small–medium. Phase 2: medium. Phase 3: largest. Phase 4: medium (optional).
Overall: a few focused sessions, done incrementally — each phase leaves the site working.
