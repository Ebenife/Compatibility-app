# GenoCheck — Genotype & Rh Compatibility Checker (MVP test build)

Built per `genotype-compatibility-prd.md`: Next.js 14 + Tailwind, no auth, no
verification. Educational and decision-support tool — **not a diagnostic or
medical advice product**.

## Flow (PRD §3)

`/ ` landing → `/upload` (document or first-class manual entry) → `/confirm`
(extraction confirmation) → `/profile` (own result + general compatibility;
fully standalone) → `/partner` (invite link **or** add-on-their-behalf) →
`/invite` (partner self-upload landing) → `/pairing` (compatible / caution /
high-risk + Rh pregnancy note) → `/accept` (plain acknowledgment, not a waiver)
→ `/options` (descriptive paths) → `/consult` (plural providers per path +
dated indicative costs).

## Run locally

```bash
npm install
npm run dev   # http://localhost:3000
npm run build && npm start
```

## Deploy (Vercel)

Push to GitHub and import in Vercel — standard CI on push to `main`, preview
deployments per branch. No env vars required for the test build. Optionally set
`OPENAI_API_KEY` (Vercel env vars, never in the repo) to enable vision-based
document reading in `src/app/api/extract/route.ts`; without it the app routes
to manual entry and says so.

## Key implementation notes

- **Compatibility rules** (`src/lib/compatibility.ts`): AA/AS/AC/SS/SC pairings
  with compatible / caution / high-risk bands and plain-language reasons; Rh
  scoped to RhD with pregnancy-monitoring framing. Rare variants are flagged,
  never guessed.
- **Invites** (`src/lib/session.ts` + `src/app/api/invites/route.ts`): token
  links with no expiry; a new invite supersedes the old one. Links are
  stateless (inviter profile + token in the URL) so pairing works without
  server state; the API only powers superseded/completed messaging on a single
  instance. Swap for a minimal Supabase table for multi-instance deploys.
- **Documents**: validated client-side (10MB, jpg/png/heic/pdf), processed
  in-memory server-side, never stored. Copy stating this sits at upload and on
  results screens.
- **Content** (`src/lib/content.ts`): static, hand-compiled options, starter
  provider lists (plural per path, informational-not-endorsement), costs dated
  "as of September 2026".
- **Empty/error states** (PRD §6): covered throughout — unreadable scans,
  low-confidence flags, unsupported variants, waiting/superseded/completed
  invites, duplicate detection, no-listings fallback, network retry.

## Before launch (PRD §7 — start now, in parallel)

A hematologist or genetic counselor must review the rule table, disclaimers and
options content. Suggested leads: Sickle Cell Foundation Nigeria / National
Sickle Cell Centre (Idi-Araba, Lagos), LUTH & UCH genetics units, Genetics
Society of Nigeria / NiSHG, independent counseling practices. Genetic
counselors are genuinely scarce in Nigeria — budget extra lead time.
