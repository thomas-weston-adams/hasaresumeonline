# Redesign rollback — what changed and how to undo it

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
