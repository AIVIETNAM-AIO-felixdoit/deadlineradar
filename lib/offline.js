// Rule-based fallback so the app works without an API key.
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];

// Second Sunday of March to first Sunday of November (US daylight saving).
function usDst(y, m, d) {
  const nthSunday = (month, n) => {
    const first = new Date(Date.UTC(y, month, 1)).getUTCDay();
    return 1 + ((7 - first) % 7) + 7 * (n - 1);
  };
  const start = Date.UTC(y, 2, nthSunday(2, 2));
  const end = Date.UTC(y, 10, nthSunday(10, 1));
  const t = Date.UTC(y, m, d);
  return t >= start && t < end;
}

function offsetHours(tz, y, m, d) {
  const dst = usDst(y, m, d);
  const fixed = { UTC: 0, GMT: 0, EST: -5, EDT: -4, CST: -6, CDT: -5, MST: -7, MDT: -6, PST: -8, PDT: -7, ICT: 7, JST: 9, CET: 1, CEST: 2, IST: 5.5 };
  const us = { ET: -5, CT: -6, MT: -7, PT: -8 };
  if (tz in us) return us[tz] + (dst ? 1 : 0);
  if (tz in fixed) return fixed[tz];
  const gmt = tz.match(/^(?:GMT|UTC)([+-]\d{1,2})$/);
  return gmt ? Number(gmt[1]) : null;
}

const TZ = "(ET|EST|EDT|CT|CST|CDT|MT|MST|MDT|PT|PST|PDT|UTC|GMT|ICT|JST|CET|CEST|IST|(?:GMT|UTC)[+-]\\d{1,2})";
const TIME = "(\\d{1,2})(?::(\\d{2}))?\\s*(am|pm|a\\.m\\.|p\\.m\\.)?";
const PATTERN = new RegExp(
  "(?:(?:mon|tue|wed|thu|fri|sat|sun)[a-z]*,?\\s+)?" +
    "(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\\.?\\s+(\\d{1,2})(?:st|nd|rd|th)?(?:,?\\s+(\\d{4}))?" +
    "(?:\\s*(?:at|@|,|-)?\\s*" + TIME + ")?" +
    "(?:\\s*\\(?\\s*" + TZ + "\\)?)?",
  "gi",
);

export function extractOffline(text, now = new Date()) {
  const results = [];
  for (const line of text.split(/\r?\n/)) {
    for (const match of line.matchAll(PATTERN)) {
      const [quote, mon, day, year, hh, mm, ampm, tzRaw] = match;
      const m = MONTHS.indexOf(mon.toLowerCase().slice(0, 3));
      const d = Number(day);
      let y = year ? Number(year) : now.getUTCFullYear();
      if (!year && Date.UTC(y, m, d) < now.getTime() - 86400000) y += 1;
      let h = hh ? Number(hh) : 23;
      const min = hh ? Number(mm || 0) : 59;
      const ap = ampm?.toLowerCase().replace(/\./g, "");
      if (ap === "pm" && h < 12) h += 12;
      if (ap === "am" && h === 12) h = 0;
      // Fall back to a timezone mentioned anywhere in the text, e.g. "(all times ET)".
      const tz = (tzRaw || text.match(new RegExp("\\b" + TZ + "\\b", "i"))?.[1] || "UTC").toUpperCase();
      const off = offsetHours(tz, y, m, d) ?? 0;
      const utc = new Date(Date.UTC(y, m, d, h, min) - off * 3600000);
      const title = line.replace(quote, "").replace(/[\s:–—-]+$/, "").replace(/^[\s:–—-]+/, "").trim().slice(0, 80) || "Deadline";
      results.push({ title, datetime_utc: utc.toISOString(), source_timezone: tz, quote: quote.trim() });
    }
  }
  return results;
}
