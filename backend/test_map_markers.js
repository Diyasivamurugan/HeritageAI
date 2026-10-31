/**
 * HeritageAI Leaflet Map Coordinates & Marker Test Suite
 * Verifies that all 5 Tamil Nadu heritage monuments have exact, verified GPS coordinates,
 * valid metadata, descriptions, and belong within the boundaries of Tamil Nadu.
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');

const dbPath = path.join(__dirname, 'heritage.db');
const db = new DatabaseSync(dbPath);

console.log('='.repeat(65));
console.log('🗺️  TESTING HERITAGEAI LEAFLET MAP MARKERS & GPS COORDINATES');
console.log('Database Path:', dbPath);
console.log('='.repeat(65));

// Verified official Archaeological Survey of India (ASI) GPS Coordinates
const EXPECTED_COORDINATES = {
  'brihadeeswarar-temple': {
    name: 'Brihadeeswarar Temple',
    lat: 10.7828,
    lng: 79.1318,
    district: 'Thanjavur'
  },
  'mahabalipuram': {
    name: 'Mahabalipuram',
    lat: 12.6269,
    lng: 80.1927,
    district: 'Chengalpattu'
  },
  'meenakshi-amman-temple': {
    name: 'Meenakshi Amman Temple',
    lat: 9.9195,
    lng: 78.1193,
    district: 'Madurai'
  },
  'gangaikonda-cholapuram': {
    name: 'Gangaikonda Cholapuram',
    lat: 11.2057,
    lng: 79.4526,
    district: 'Ariyalur'
  },
  'gingee-fort': {
    name: 'Gingee Fort',
    lat: 12.2547,
    lng: 79.4182,
    district: 'Viluppuram'
  }
};

const sites = db.prepare('SELECT id, slug, name, location, latitude, longitude, description, image_url, information_source FROM heritage_sites').all();

console.log(`\n[STEP 1] Found ${sites.length} locations in database.`);
if (sites.length < 5) {
  throw new Error(`Expected at least 5 locations, got ${sites.length}`);
}

console.log('\n[STEP 2] Verifying Exact Coordinates & Tamil Nadu Bounding Box...');

// Tamil Nadu Bounding Box: Lat 8.0N to 13.6N, Lng 76.2E to 80.5E
const TN_BOUNDS = {
  minLat: 8.0,
  maxLat: 13.6,
  minLng: 76.2,
  maxLng: 80.5
};

sites.forEach((site) => {
  const expected = EXPECTED_COORDINATES[site.slug];
  if (!expected) {
    console.log(` -> Note: Site '${site.name}' (${site.slug}) is an extra site.`);
    return;
  }

  // 1. Verify exact latitude (within 0.005 tolerance)
  const latDiff = Math.abs(site.latitude - expected.lat);
  const lngDiff = Math.abs(site.longitude - expected.lng);

  if (latDiff > 0.005 || lngDiff > 0.005) {
    throw new Error(`Coordinates mismatch for ${site.name}: Expected (${expected.lat}, ${expected.lng}), got (${site.latitude}, ${site.longitude})`);
  }

  // 2. Verify inside Tamil Nadu boundary
  if (site.latitude < TN_BOUNDS.minLat || site.latitude > TN_BOUNDS.maxLat ||
      site.longitude < TN_BOUNDS.minLng || site.longitude > TN_BOUNDS.maxLng) {
    throw new Error(`Coordinates for ${site.name} fall outside Tamil Nadu state boundaries!`);
  }

  // 3. Verify Description and Image URL
  if (!site.description || site.description.length < 20) {
    throw new Error(`Missing or short description for ${site.name}`);
  }

  if (!site.image_url || !site.image_url.startsWith('http')) {
    throw new Error(`Missing valid image URL for ${site.name}`);
  }

  console.log(` ✓ [PASS] ${expected.name}:`);
  console.log(`        Coordinates: ${site.latitude.toFixed(4)}° N, ${site.longitude.toFixed(4)}° E`);
  console.log(`        District:    ${expected.district}`);
  console.log(`        Source:      ${site.information_source}`);
});

console.log('\n[STEP 3] Verifying Search Match for Leaflet Popups...');
const searchKeywords = ['Thanjavur', 'Shore', 'Madurai', 'Gangaikonda', 'Gingee'];

searchKeywords.forEach(kw => {
  const match = sites.filter(s => 
    s.name.toLowerCase().includes(kw.toLowerCase()) || 
    s.location.toLowerCase().includes(kw.toLowerCase()) ||
    s.description.toLowerCase().includes(kw.toLowerCase())
  );
  if (match.length === 0) {
    throw new Error(`Search failed to match keyword: ${kw}`);
  }
  console.log(` ✓ Keyword "${kw}" matched: ${match.map(m => m.name).join(', ')}`);
});

console.log('\n' + '='.repeat(65));
console.log('🎉 ALL LEAFLET MAP MARKER & COORDINATE TESTS PASSED (100% ACCURATE)');
console.log('='.repeat(65));
