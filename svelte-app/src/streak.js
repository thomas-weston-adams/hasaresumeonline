// Running streak, counted in the runner's own time zone so every visitor
// sees the same number no matter where they are.
//
// The start date is day 1. On 2026-09-29 (America/Los_Angeles) a streak
// that began 2018-10-15 reads 2,907 days and 7 whole years.

function calendarDateIn(timeZone, when) {
  // en-CA formats as YYYY-MM-DD
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', {
    timeZone, year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(when).split('-').map(Number);
  return { y, m, d };
}

export function computeStreak(startISO, timeZone, now = new Date()) {
  const [sy, sm, sd] = startISO.split('-').map(Number);
  const { y, m, d } = calendarDateIn(timeZone, now);

  // Whole-day difference between two calendar dates, immune to DST.
  const elapsed = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(sy, sm - 1, sd)) / 86400000);
  const days = elapsed + 1;

  const beforeAnniversary = m < sm || (m === sm && d < sd);
  const years = y - sy - (beforeAnniversary ? 1 : 0);

  return { days, years };
}
