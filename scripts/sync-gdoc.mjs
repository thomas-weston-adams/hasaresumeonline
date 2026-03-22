/**
 * Syncs resume data from Google Doc into svelte-app/src/data.json
 *
 * The Google Doc should use these section headings (## Heading Name):
 *   ## Professional Overview     → statement
 *   ## Educational Background    → educationDegrees + educationDegreesList
 *   ## Key Expertise Areas       → coreSkills (bullet list)
 *   ## Emergency Management      → emergencyContent
 *   ## Education & Teaching      → educationContent
 *   ## Public Service            → publicServiceContent
 *   ## Certifications            → certificationsContent
 *   ## Professional Affiliations → affiliations (bullet list)
 *   ## Stats                     → stats (lines like "17+ | Years Teaching Experience")
 *   ## Publications              → publications (lines like "Author | Title | Publisher | Year | Optional award")
 *   ## Awards                    → awards (bullet list)
 *   ## Work Experience           → workExperience (structured blocks, see below)
 *   ## Teaching Institutions     → teachingInstitutions (bullet list)
 *
 * Work Experience block format (repeated per job):
 *   ### Job Title | Org Name | Date Range
 *   - bullet one
 *   - bullet two
 */

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = join(__dirname, '../svelte-app/src/data.json');
const DOC_ID = '1qf27IW1HUVErAqOjJo22ISL4J0qV674DfuiBUvg4KHA';
const EXPORT_URL = `https://docs.google.com/document/d/${DOC_ID}/export?format=txt`;

async function fetchDoc() {
  console.log('Fetching Google Doc...');
  const res = await fetch(EXPORT_URL, { redirect: 'follow' });
  if (!res.ok) throw new Error(`Failed to fetch doc: ${res.status}`);
  return res.text();
}

function parseSection(text, heading) {
  const lines = text.split('\n');
  let inSection = false;
  const content = [];

  for (const line of lines) {
    if (line.match(new RegExp(`^##\\s*${heading}`, 'i'))) {
      inSection = true;
      continue;
    }
    if (inSection && line.startsWith('## ')) break;
    if (inSection) content.push(line);
  }

  return content.join('\n').trim();
}

function parseBulletList(sectionText) {
  return sectionText
    .split('\n')
    .map(l => l.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean);
}

function parseStats(sectionText) {
  return sectionText
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const [number, ...labelParts] = l.split('|');
      return { number: number.trim(), label: labelParts.join('|').trim() };
    })
    .filter(s => s.number && s.label);
}

function parsePublications(sectionText) {
  return sectionText
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const parts = l.split('|').map(p => p.trim());
      // Format: Role | Title | Publisher | Year | Award (optional)
      if (parts.length < 4) return null;
      const pub = { role: parts[0], title: parts[1], publisher: parts[2], year: parts[3] };
      if (parts[4]) pub.award = parts[4];
      return pub;
    })
    .filter(Boolean);
}

function parseDegrees(sectionText) {
  return sectionText
    .split('\n')
    .map(l => l.replace(/^[-*•]\s*/, '').trim())
    .filter(Boolean)
    .map(l => {
      // Format: "Degree | Field | Institution"
      const parts = l.split('|').map(p => p.trim());
      if (parts.length === 3) return { degree: parts[0], field: parts[1], institution: parts[2] };
      // Fallback: treat the whole line as a flat string
      return { degree: '', field: l, institution: '' };
    });
}

function parseWorkExperience(sectionText) {
  const jobs = [];
  let current = null;

  for (const raw of sectionText.split('\n')) {
    const line = raw.trim();
    if (!line) continue;

    // Job header: ### Title | Org | Dates
    if (line.startsWith('### ')) {
      if (current) jobs.push(current);
      const parts = line.replace(/^###\s*/, '').split('|').map(p => p.trim());
      current = { title: parts[0] || '', org: parts[1] || '', dates: parts[2] || '', bullets: [] };
    } else if (current && line.match(/^[-*•]/)) {
      current.bullets.push(line.replace(/^[-*•]\s*/, '').trim());
    }
  }
  if (current) jobs.push(current);
  return jobs;
}

async function main() {
  const docText = await fetchDoc();
  const current = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

  const updated = { ...current };

  // Professional Overview → statement
  const overview = parseSection(docText, 'Professional Overview');
  if (overview) updated.statement = overview;

  // Educational Background → educationDegrees + educationDegreesList
  const eduBg = parseSection(docText, 'Educational Background');
  if (eduBg) {
    const degrees = parseDegrees(eduBg);
    if (degrees.length > 0) {
      updated.educationDegreesList = degrees;
      updated.educationDegrees = degrees.map(d => [d.degree, d.field, d.institution].filter(Boolean).join(' – ')).join('; ');
    }
  }

  // Key Expertise Areas → coreSkills
  const expertise = parseSection(docText, 'Key Expertise Areas');
  if (expertise) {
    const skills = parseBulletList(expertise);
    if (skills.length > 0) updated.coreSkills = skills;
  }

  // Emergency Management → emergencyContent
  const emergency = parseSection(docText, 'Emergency Management');
  if (emergency) updated.emergencyContent = emergency;

  // Education & Teaching → educationContent
  const education = parseSection(docText, 'Education.*Teaching');
  if (education) updated.educationContent = education;

  // Public Service → publicServiceContent
  const publicService = parseSection(docText, 'Public Service');
  if (publicService) updated.publicServiceContent = publicService;

  // Certifications → certificationsContent
  const certs = parseSection(docText, 'Certifications');
  if (certs) updated.certificationsContent = certs;

  // Professional Affiliations → affiliations
  const affiliations = parseSection(docText, 'Professional Affiliations');
  if (affiliations) {
    const orgs = parseBulletList(affiliations);
    if (orgs.length > 0) updated.affiliations = orgs;
  }

  // Stats section (optional)
  const statsSection = parseSection(docText, 'Stats');
  if (statsSection) {
    const stats = parseStats(statsSection);
    if (stats.length > 0) updated.stats = stats;
  }

  // Publications → publications
  const pubSection = parseSection(docText, 'Publications');
  if (pubSection) {
    const pubs = parsePublications(pubSection);
    if (pubs.length > 0) updated.publications = pubs;
  }

  // Awards → awards
  const awardsSection = parseSection(docText, 'Awards');
  if (awardsSection) {
    const awardsList = parseBulletList(awardsSection);
    if (awardsList.length > 0) updated.awards = awardsList;
  }

  // Work Experience → workExperience
  const workSection = parseSection(docText, 'Work Experience');
  if (workSection) {
    const jobs = parseWorkExperience(workSection);
    if (jobs.length > 0) updated.workExperience = jobs;
  }

  // Teaching Institutions → teachingInstitutions
  const teachingSection = parseSection(docText, 'Teaching Institutions');
  if (teachingSection) {
    const insts = parseBulletList(teachingSection);
    if (insts.length > 0) updated.teachingInstitutions = insts;
  }

  // Name/Title from doc title line (first non-empty line)
  const firstLine = docText.split('\n').find(l => l.trim());
  if (firstLine && !firstLine.startsWith('#')) {
    // Only update if it looks like a name (not a heading)
    updated.name = firstLine.trim();
  }

  const newContent = JSON.stringify(updated, null, 2);
  const oldContent = JSON.stringify(current, null, 2);

  if (newContent === oldContent) {
    console.log('No changes detected in Google Doc.');
    process.exit(0);
  }

  writeFileSync(DATA_PATH, newContent + '\n');
  console.log('data.json updated from Google Doc.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
