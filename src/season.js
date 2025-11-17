// src/season.js
// A lightweight Seasons.js library based on the spec in specs/seasonjs.md
// It exposes a single `getSeason` function that returns the season name
// for a given date and optional configuration.
//
// Supported options:
//  - calendarType: "Astronomical" | "Meteorological" (default "Astronomical")
//  - seasonType: "Calendar" | "Special" ("Special" not implemented)
//  - hemisphere: "Northern" | "Southern" (auto‑derived if omitted)
//  - countryCode: ISO 3166‑1 alpha‑2 (used to infer hemisphere)
//  - languageCulture: e.g. "en-US" (not used in this simplified version)
//  - latitude, longitude: numeric GPS coordinates (used to infer hemisphere)
//
// The library defaults to the Northern Hemisphere if no hemisphere information
// is available.

const southernCountryCodes = [
  // Africa
  'AO','BW','BI','KM','LS','MG','MW','MU','MZ','NA','RW','SC','ZA','SZ','TZ','ZM','ZW',
  'CD','GA','CG',
  // Asia
  'TL','ID',
  // Australia
  'AU','PG',
  // South America
  'AR','BO','CL','PY','PE','UY','BR','EC',
  // Pacific Ocean
  'AS','CK','FJ','PF','NR','NC','NZ','NU','PN','WS','SB','TK','TO','TV','VU','WF',
  // Atlantic Ocean
  'FK','SH',
  // Indian Ocean
  'IO','YT','RE',
  // Southern Ocean (some islands)
  'AQ','BV','TF','GS',
];

/**
 * Determine if the given country code is in the Southern Hemisphere.
 * @param {string} countryCode ISO 3166‑1 alpha‑2 code
 * @returns {boolean}
 */
function isSouthernCountry(countryCode) {
  if (!countryCode) return false;
  return southernCountryCodes.includes(countryCode.toUpperCase());
}

/**
 * Infer hemisphere from provided data.
 * @param {Object} options
 * @returns {'Northern'|'Southern'}
 */
function inferHemisphere(options) {
  const { hemisphere, latitude, longitude, countryCode } = options;
  if (hemisphere === 'Northern' || hemisphere === 'Southern') {
    return hemisphere;
  }
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    // Simplified: lat >= 0 => Northern
    return latitude >= 0 ? 'Northern' : 'Southern';
  }
  if (countryCode && isSouthernCountry(countryCode)) {
    return 'Southern';
  }
  // Default to Northern
  return 'Northern';
}

/**
 * Check if a date is between two month/day ranges, inclusive.
 * Handles ranges that cross the year boundary.
 * @param {Date} date
 * @param {string} start "MM-DD"
 * @param {string} end "MM-DD"
 * @returns {boolean}
 */
function isDateInRange(date, start, end) {
  const month = date.getMonth() + 1; // JS months 0-11
  const day = date.getDate();
  const [sMonth, sDay] = start.split('-').map(Number);
  const [eMonth, eDay] = end.split('-').map(Number);
  const startNum = sMonth * 100 + sDay;
  const endNum = eMonth * 100 + eDay;
  const curNum = month * 100 + day;
  if (startNum <= endNum) {
    return curNum >= startNum && curNum <= endNum;
  }
  // Range crosses year boundary
  return curNum >= startNum || curNum <= endNum;
}

/**
 * Season definitions for each calendar type and hemisphere.
 */
const seasonDefinitions = {
  Astronomical: {
    Northern: {
      Spring:  { start: '03-21', end: '06-20' },
      Summer:  { start: '06-21', end: '09-20' },
      Autumn:  { start: '09-21', end: '12-20' },
      Winter:  { start: '12-21', end: '03-20' },
    },
    Southern: {
      Spring:  { start: '09-21', end: '12-20' },
      Summer:  { start: '12-21', end: '03-20' },
      Autumn:  { start: '03-21', end: '06-20' },
      Winter:  { start: '06-21', end: '09-20' },
    },
  },
  Meteorological: {
    Northern: {
      Spring:  { start: '03-01', end: '05-31' },
      Summer:  { start: '06-01', end: '08-31' },
      Autumn:  { start: '09-01', end: '11-30' },
      Winter:  { start: '12-01', end: '02-29' },
    },
    Southern: {
      Spring:  { start: '09-01', end: '11-30' },
      Summer:  { start: '12-01', end: '02-29' },
      Autumn:  { start: '03-01', end: '05-31' },
      Winter:  { start: '06-01', end: '08-31' },
    },
  },
};

/**
 * Get the season for a given date and options.
 * @param {Date} [date=new Date()] The date to evaluate.
 * @param {Object} [options] Configuration options.
 * @param {string} [options.calendarType='Astronomical']
 * @param {string} [options.seasonType='Calendar'] (Special not implemented)
 * @param {string} [options.hemisphere] 'Northern' or 'Southern'
 * @param {string} [options.countryCode]
 * @param {number} [options.latitude]
 * @param {number} [options.longitude]
 * @returns {string} Season name (Spring, Summer, Autumn, Winter)
 */
function getSeason(date = new Date(), options = {}) {
  const {
    calendarType = 'Astronomical',
    // seasonType is ignored in this simple implementation
  } = options;

  const hemisphere = inferHemisphere(options);
  const defs = seasonDefinitions[calendarType][hemisphere];

  for (const [season, range] of Object.entries(defs)) {
    if (isDateInRange(date, range.start, range.end)) {
      return season;
    }
  }
  // Fallback
  return 'Unknown';
}

/**
 * Exported API.
 */
export { getSeason };

// For Node CommonJS compatibility


// Example usage:
// console.log(getSeason(new Date()));
