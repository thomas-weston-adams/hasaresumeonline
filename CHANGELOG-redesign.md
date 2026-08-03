# Redesign rollback — what changed and how to undo it

## Round 5 (content-preview tags, new certifications from your portfolio PDF)

- **Collapsed sections now show small "content preview" pills** under the
  teaser paragraph — e.g. Emergency Management shows "📷 Photos · 📋 Program
  Details · 🏅 Commendations," Personal Excellence shows "📷 Photos · 🌍 30+
  Countries · 🏃 Daily Streak." These are honest, specific previews of
  what's actually inside each dropdown (not generic "click here" filler),
  meant to make it obvious there's real substance behind the collapse
  without adding visual clutter — small rounded pills, one line, done.
- **Added 7 new certifications** from your Training & Certification
  Portfolio PDF that weren't already on the site: IS-230.e (Fundamentals of
  Emergency Management), NIMS All-Hazards Situation Unit Leader, O-305
  (USFA Type 3 Incident Management Team Training), MGT-314 (Enhanced
  All-Hazards Incident Management/Unified Command, TEEX), CDP's Key
  Planning Factors for Chemical Incident Response & Recovery (directly
  relevant to CSEPP), G-386 (Mass Fatalities), and the PAST Fusion Academy
  PIO/social-media spokesperson training. Everything else in the portfolio
  (ICS-100/200/300/400, IS-235/700/800/2200, HSEEP, IS-29/42.a/120/240/
  241/244/650.b/909/317.a, G-191) was already listed — no duplicates added.
  Skipped a couple of low-signal generic entries (e.g. "IS-13: Conduct and
  Behavior," the meta "Professional Development Series" completion
  certificate) as not worth a dedicated line. Send the rest as you finish
  assembling them and I'll fold them in the same way.
- Certifications & Key Training now covers 44 courses/certifications total
  (was 37).

---

## Round 4 (nav overflow bug, stats reorg, clearer collapse buttons, PM skill)

- **Fixed a real bug**: the nav's `grid-template-columns: repeat(6, 1fr)`
  didn't let grid tracks shrink below their content's natural width, and
  since `.container` has `overflow: hidden`, the excess got silently
  clipped instead of wrapping — this is what caused "Publications" and
  "Affiliations" to look cut off on laptop-width Chrome. Fixed at all four
  breakpoints with `minmax(0, 1fr)` plus `min-width: 0` on the nav items.
  Verified no overflow at 1280/1366/1440px viewports.
- **Stats bar reorganized to 4 items** (was 3): "17+ Years Teaching &
  Coaching Communication," "10+ Years Public Service Leadership" (replaces
  "8+ Years Emergency Management & Search & Rescue" — broader framing,
  matches your own resume's "more than a decade of public-sector
  leadership" line), "1000s Students, Trainees & Teammates Coached"
  (brought back from the original redesign attempt), and "7+ Years Daily
  Running Streak" (kept).
- **Collapse/expand affordance redesigned**: the chevron is now a solid
  filled circle button (was a bare outline icon), and the hint text changed
  from faint italic "tap to expand" to bold "Click to expand" / "Click to
  collapse" — should read as an obvious, clickable control now.
- **Added Project & Program Management**: new tile in Core Competencies →
  Planning, Grants & Analysis (leads the category), plus the phrase
  "program management" worked into the Emergency Management section's
  teaser, its Work Experience bullet, and its highlights — grounded in the
  actual CSEPP program stewardship/drawdown work, not a new claim.

---

## Round 3 (collapsible sections restored, for scannability)

You asked what happened to the collapsible menus, specifically for
scannability — Business Leaders, HR people, and headhunters don't want to
scroll a ~13,000px wall of photos and paragraphs; they want to scan section
headers and open only what's relevant. Round 1 had reverted every section
back to always-open (no collapse at all, except Competencies/
Certifications/Affiliations). Round 3 restores collapse-by-default on
every section, but fixes the thing that made it feel sparse the first
time around: the teaser is now a real 2–4 sentence paragraph of specific,
factual highlights (drawn from each section's own content — nothing
invented) instead of a single thin italic line.

- All 12 sections are now collapsible and closed by default, each with a
  substantive teaser paragraph.
- Fixed a bug (recurring from the original redesign attempt): a standalone
  photo between the Emergency Management and Communication sections lived
  outside any `ResumeSection`, so it kept showing even when that section
  was collapsed. Moved it inside so collapsing actually collapses it.
- Nav is untouched — still the original 12-tile icon grid.
- Full page height dropped from ~13,000px to ~4,250px in the collapsed
  state; every photo and paragraph is still there, one click away.

If this feels like too much collapsing again, the easiest dial to turn is
picking specific sections to leave open by default (e.g., Emergency
Management, since it's the flagship one) rather than all-or-nothing.

---

## Round 2 (after you said "I don't want it how I had it")

Round 1 (below) reverted *structure and copy* both. That overcorrected —
you wanted the structure back (nav, open-by-default sections, more visible
photos/text) but you still wanted the executive/coaching *positioning* in
the copy. Round 2 keeps Round 1's structure and rewrites the copy layer on
top of it:

- **Hero tagline** — added "& Coach" to the Educator line: "Strategic
  Communicator | Educator & Coach / Relationship Builder | Community
  Partner / Field Responder | Public Servant." Same structure as your
  original, no "Crisis Leader," no "Public Service Executive."
- **Hero intro paragraph** — kept ~90% of your original wording; wove in
  two sentences: "...non-profit, education, and coaching leadership...
  Communication runs through all of it: nearly two decades teaching people
  how to do it well, and I coach as much as I teach," and "Now I'm ready to
  bring that same experience into the private sector."
- **Stats bar, stat 1** — "Years Teaching Experience" → "Years Teaching &
  Coaching Communication" (number unchanged, 17+).
- **Core Competencies** — "Communication" category moved to the front of
  the list (was 2nd, now 1st) to push communication expertise forward, as
  you originally asked. No renaming, no new categories.
- **Section title** — "Teaching & Communication" → "Communication,
  Coaching & Teaching" (nav label "Teaching" → "Communication" to match).
- **Profile photo** — sized up from 190×240 to 230×290 on desktop (and
  proportionally on tablet/mobile) since you flagged it as too small.
- **Audio-intro script** — added the matching "private sector" closing
  clause for consistency with the hero paragraph.

Nothing from Round 1's structural revert changed again: nav is still the
original 12-tile icon grid, sections are still open by default, "Crisis
Leadership" is still not used as a repeated label.

---



You said the executive redesign overcorrected: the nav got ugly, the hero
copy read like buzzwords, sections collapsing by default made the page feel
thin on images and text, and "Public Service Executive/Leadership" wasn't
language you want representing you publicly. This reverts nearly all of it
back to the version from **May 22, 2026** (commit `ef27b8a`) — the one you
built and were happy with — and keeps only two things.

## What's back to the original (byte-for-byte identical to `ef27b8a`)

- **Nav** — the original 12-tile icon grid (🚨 Emergency Management, 🎓
  Teaching, 🎓 Education, 🤝 Public Service, 💼 Work Experience, 📚
  Publications, 🏆 Awards, 🏃 Personal Excellence, 🌱 Community Service, ⚡
  Competencies, 📋 Certifications, 🏢 Affiliations). No slim text bar, no
  "View Full Page" toggle, no `forceOpen` machinery.
- **Hero tagline** — "Strategic Communicator | Educator, Relationship
  Builder | Community Partner, Field Responder | Public Servant." No
  "Crisis Leader," no "Public Service Executive."
- **Hero intro paragraph** — your original "I built this site to share a
  fuller picture..." statement, word for word.
- **Stats bar** — "17+ Years Teaching Experience," "8+ Years Emergency
  Management & Search & Rescue," "7+ Years Daily Running Streak."
- **Section titles** — "Emergency Management / Search & Rescue," "Teaching
  & Communication," etc. — none renamed to lead with "Crisis Leadership."
- **Default section state** — every section is open and fully visible on
  load again (only Core Competencies, Certifications, and Affiliations are
  collapsible, exactly as before). Photos, full paragraphs, and sub-details
  all show immediately — nothing is hidden behind a click by default.
- **Closing CTA** — original wording, no "public-sector crisis experience"
  or "public service leadership" pitch language.
- **Header photo size, fonts, colors, CSS** — untouched, original.
- **`docs/index.html`** `<title>`, meta description, and the accessibility
  widget's spoken audio-intro text — reverted to original (with one small
  coaching clause added, see below).

## What's kept (the two things you'd actually asked for that survived)

1. **Music-player scroll bug fix** (`MusicPlayer.svelte`) — the fixed audio
   bar at the bottom used `backdrop-filter: blur()`, a documented cause of
   fixed bars detaching/floating on mobile Safari during scroll. Swapped
   for a solid background and pinned it to its own compositor layer. Pure
   bug fix, no visual change to the bar's look.
2. **Small, additive "coaching" mentions** — nothing renamed, no new
   sections, no new nav items:
   - One new bullet in Teaching & Communication's highlights: "Coached
     hundreds of students through high-stakes presentations and
     competitive speech — coaching I still bring to mentoring colleagues
     and training teammates today."
   - One added clause in that section's body paragraph: "...coaching is as
     much a part of how I work as teaching is."
   - One new tile in Core Competencies → Team & Community: "Coaching &
     Individual Development," sitting alongside the existing "Team
     Leadership, Supervision & Mentoring" tile.
   - One added clause in the audio-intro script: "...coaching many of them
     through their toughest presentations along the way."

## If you want to undo even the coaching mentions

Everything above the "What's kept" section is a straight revert to
`ef27b8a`. If you want to strip the coaching additions too and go back to
that commit exactly, tell me and I'll do it — it's four small, isolated
edits (listed above) to reverse.

## Still open / needs your call

- **"I want to see it live"** — I don't have a way to hand you a clickable
  URL from this sandbox; the branch isn't wired to a preview deploy. I can
  either (a) send you screenshots now, or (b) open a PR / merge to `main`
  so GitHub Pages picks it up at your live domain — tell me which.
- You were "still uncertain about crisis leadership everywhere" — the
  redesign's "Crisis Leader"/"Crisis Leadership" additions are gone now,
  but the *original* site already used "Crisis Communication & High-Stakes
  Briefing" as a Core Competencies tile (that's original content, not
  something I added). Flag it if you want that gone too.
