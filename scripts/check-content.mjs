/**
 * Guards svelte-app/src/data.json (the site's single content source)
 * against Tommy's standing content rules. Runs before every build
 * (`npm run build` in svelte-app) and fails the build on any violation.
 *
 *   node scripts/check-content.mjs
 *
 * To change a rule, edit the lists below. Each rule says why it exists.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const here = dirname(fileURLToPath(import.meta.url));
const data = JSON.parse(readFileSync(join(here, '../svelte-app/src/data.json'), 'utf8'));

const banned = [
  [/ph\.?\s?d\.?\s*(candidacy|candidate|program)|\bABD\b/i, 'Penn State is "doctoral coursework," never PhD program/candidate/ABD'],
  [/division director/i, 'Title is Section Supervisor, never Division Director'],
  [/planned parenthood|\bdobbs\b/i, 'Never name that endorsement or use Dobbs framing'],
  [/tornado/i, 'Never use a Lexington tornado-inject story'],
  [/crisis (communication|spokes)/i, 'Crisis coordination, never crisis spokesmanship'],
  [/\b(moreover|furthermore|additionally)\b/i, 'Style: no Moreover / Furthermore / Additionally'],
  [/\bI believe\b/, 'Style: no "I believe"'],
  [/\btidy\b/i, 'Style: never "tidy"'],
  [/\bintersection\b|\bbridg(e|es|ing)\b/i, 'Style: no intersection / bridge metaphors'],
  [/\b(senior leader|director-level)\b/i, 'Never self-label senior leader / director-level'],
  [/passionate, lifelong/i, 'Old tagline is retired'],
  [/\bon (the )?state eoc\b/i, 'Served IN the EOC: it is a place, not a team'],
  [/private sector/i, 'Portland and similar roles are public sector; that line was cut']
];

const problems = [];

// Walk every string in the content file, remembering where it lives.
function walk(value, path) {
  if (typeof value === 'string') {
    for (const [re, why] of banned) {
      const m = value.match(re);
      if (m) problems.push(`${path}: "${m[0]}" — ${why}`);
    }
  } else if (Array.isArray(value)) {
    value.forEach((v, i) => walk(v, `${path}[${i}]`));
  } else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) walk(v, path ? `${path}.${k}` : k);
  }
}
walk(data, '');

// Exactly ten institutions.
const teaching = data.teachingInstitutions || [];
if (teaching.length !== 10) {
  problems.push(`teachingInstitutions: ${teaching.length} entries — must be exactly ten`);
}

// KYEM ended in 2026; nothing should call it current.
for (const list of ['workExperience', 'additionalWorkHistory']) {
  for (const job of data[list] || []) {
    if (/Kentucky Emergency Management/.test(job.org) && /present|current/i.test(job.dates)) {
      problems.push(`${list} KYEM dates "${job.dates}" — KYEM is 05/2023 – 2026`);
    }
  }
}

// The streak counter needs a real start date and zone.
if (!/^\d{4}-\d{2}-\d{2}$/.test(data.streak?.start || '') || !data.streak?.timeZone) {
  problems.push('streak: needs start (YYYY-MM-DD) and timeZone');
}

if (problems.length) {
  console.error(`Content check failed (${problems.length}):\n  - ` + problems.join('\n  - '));
  process.exit(1);
}
console.log('Content check passed.');
