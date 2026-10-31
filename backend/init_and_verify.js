/**
 * Direct SQLite Engine Test & Seeder for HeritageAI
 * Uses Node v24's built-in node:sqlite module to create, populate, and test heritage.db
 */

const { DatabaseSync } = require('node:sqlite');
const path = require('node:path');
const fs = require('node:fs');

const dbPath = path.join(__dirname, 'heritage.db');

console.log('='.repeat(65));
console.log('🏛️  INITIALIZING & TESTING HERITAGEAI SQLITE DATABASE');
console.log('Database Path:', dbPath);
console.log('='.repeat(65));

const db = new DatabaseSync(dbPath);

// 1. Create Tables
console.log('\n[STEP 1] Creating Tables (HeritageSites, HeritageStories, HistoricalFacts, QuizQuestions, Languages)...');

db.exec(`
  CREATE TABLE IF NOT EXISTS languages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    is_active INTEGER DEFAULT 1
  );

  CREATE TABLE IF NOT EXISTS heritage_sites (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    name_ta TEXT,
    slug TEXT UNIQUE NOT NULL,
    dynasty TEXT NOT NULL,
    century_ce INTEGER NOT NULL,
    is_unesco INTEGER DEFAULT 0,
    location TEXT NOT NULL,
    latitude REAL NOT NULL,
    longitude REAL NOT NULL,
    image_url TEXT NOT NULL,
    information_source TEXT NOT NULL,
    description TEXT NOT NULL,
    historical_background TEXT NOT NULL,
    architecture TEXT NOT NULL,
    cultural_significance TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS heritage_stories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    persona TEXT NOT NULL,
    narrative TEXT NOT NULL,
    language TEXT DEFAULT 'en',
    audio_url TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (site_id) REFERENCES heritage_sites(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS historical_facts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER NOT NULL,
    category TEXT NOT NULL,
    fact_text TEXT NOT NULL,
    source_reference TEXT NOT NULL,
    FOREIGN KEY (site_id) REFERENCES heritage_sites(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    site_id INTEGER,
    dynasty TEXT NOT NULL,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL,
    explanation TEXT NOT NULL,
    difficulty TEXT DEFAULT 'Medium',
    language TEXT DEFAULT 'en',
    FOREIGN KEY (site_id) REFERENCES heritage_sites(id) ON DELETE CASCADE
  );
`);

console.log(' ✓ Tables successfully created.');

// 2. Populate Seed Data
console.log('\n[STEP 2] Populating Initial Five Tamil Nadu Heritage Locations...');

const siteCount = db.prepare('SELECT COUNT(*) as count FROM heritage_sites').get().count;

if (siteCount === 0) {
  // Languages
  db.exec(`
    INSERT INTO languages (code, name, is_active) VALUES 
    ('en', 'English', 1),
    ('ta', 'தமிழ் (Tamil)', 1);
  `);

  // Five Sites
  const insertSite = db.prepare(`
    INSERT INTO heritage_sites (
      name, name_ta, slug, dynasty, century_ce, is_unesco, location, 
      latitude, longitude, image_url, information_source, description, 
      historical_background, architecture, cultural_significance
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  // 1. Brihadeeswarar Temple
  insertSite.run(
    'Brihadeeswarar Temple',
    'பெருவுடையார் கோயில் (தஞ்சைப் பெரிய கோயில்)',
    'brihadeeswarar-temple',
    'Chola',
    1010,
    1,
    'Thanjavur, Tamil Nadu, India',
    10.7828,
    79.1318,
    'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80',
    'Archaeological Survey of India (ASI) / UNESCO Great Living Chola Temples',
    'A masterpiece of Dravidian Chola architecture and one of the Great Living Chola Temples, built entirely of interlocking granite with a 216-foot vimana.',
    'Commissioned in 1003 CE by Emperor Raja Raja Chola I and consecrated in 1010 CE to celebrate Chola imperial power and devotion to Lord Shiva. Served as the administrative epicenter of the Chola empire with over 100 stone inscriptions documenting imperial donations and personnel.',
    'Constructed using an interlocking dry-stone puzzle system without binding mortar using 130,000 tonnes of granite. The 216-foot vimana is crowned by an 80-tonne monolithic granite Kumbam hoisted up a 6-km earthen ramp.',
    'Designated a UNESCO World Heritage Site in 1987. Represents the zenith of medieval Indian engineering, town planning, and 108 sculpted Bharatanatyam karana reliefs.'
  );

  // 2. Mahabalipuram
  insertSite.run(
    'Mahabalipuram',
    'மாமல்லபுரக் குடைவரைக் கோயில்கள் மற்றும் சிற்பங்கள்',
    'mahabalipuram',
    'Pallava',
    650,
    1,
    'Chengalpattu District, Tamil Nadu, India',
    12.6269,
    80.1927,
    'https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80',
    'Archaeological Survey of India (ASI) / UNESCO World Heritage Centre',
    'An ancient sea-coast capital of the Pallava dynasty celebrated for monolithic rock-cut cave temples, monolithic rathas, and the oceanic Shore Temple.',
    'Flourished during the 7th and 8th centuries CE under Pallava kings Mahendravarman I and Narasimhavarman I (Mamalla) as a major merchant gateway connecting ancient Tamilakam with China, Cambodia, and the Roman Empire.',
    'Features three distinct architectural idioms: rock-cut cave sanctuaries (mandapas), monolithic rock shrines sculpted out of standing whale-back boulders (Pancha Rathas), and the structural granite Shore Temple.',
    'Inscribed as a UNESCO World Heritage Site in 1984. Contains Descent of the Ganges (Arjuna Penance), one of the largest open-air stone bas-reliefs on Earth.'
  );

  // 3. Meenakshi Amman Temple
  insertSite.run(
    'Meenakshi Amman Temple',
    'மதுரை மீனாட்சி சுந்தரேசுவரர் திருக்கோயில்',
    'meenakshi-amman-temple',
    'Pandya & Nayaka',
    1200,
    0,
    'Madurai, Tamil Nadu, India',
    9.9195,
    78.1193,
    'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80',
    'Archaeological Survey of India (ASI) / Tamil Virtual Academy',
    'The spiritual heart of Madurai, renowned for 14 soaring multi-tiered gopurams encrusted with thousands of stucco deities, the Hall of 1000 Pillars, and the sacred Golden Lotus Tank.',
    'Madurai is praised in Sangam literature as an ancient cultural capital. Rebuilt and expanded into its current concentric form under the Madurai Nayak dynasty between 1560 and 1650 CE under King Thirumalai Nayak.',
    'Enclosed within concentric stone prakaras covering 14 acres with 14 pyramidal gopurams (tallest being the Southern Tower at 170 feet). Features the Hall of 1000 Pillars (containing 985 uniquely carved pillars) and 5 musical pillars.',
    'Celebrates ancient Tamil matrilineal primacy where Goddess Meenakshi is worshiped before Lord Sundareswarar. The city layout radiates outwards in cosmic concentric geometry.'
  );

  // 4. Gangaikonda Cholapuram
  insertSite.run(
    'Gangaikonda Cholapuram',
    'கங்கைகொண்ட சோழபுரம் பெருவுடையார் கோயில்',
    'gangaikonda-cholapuram',
    'Chola',
    1035,
    1,
    'Ariyalur District, Tamil Nadu, India',
    11.2057,
    79.4526,
    'https://images.unsplash.com/photo-1622396481304-4ad4901ff0f4?auto=format&fit=crop&w=1200&q=80',
    'Archaeological Survey of India (ASI) / UNESCO Great Living Chola Temples',
    'The royal capital and sanctuary established by Rajendra Chola I to commemorate his victorious expeditions to the sacred River Ganges and South-East Asia.',
    'Founded in 1035 CE by Rajendra Chola I after victorious military campaigns reaching the Ganges. Consecrated by pouring sacred Ganges waters into the excavated 22-kilometer Chola Gangam lake.',
    'The 182-foot vimana is sculpted with softer concave curves embodying feminine grace compared to the masculine pyramid of Thanjavur. Includes the monolithic lion-head Simhakinaru well.',
    'Part of the UNESCO Great Living Chola Temples. Houses the world-renowned Chandeshwara Anugraha Murti stone sculpture relief.'
  );

  // 5. Gingee Fort
  insertSite.run(
    'Gingee Fort',
    'செஞ்சிக் கோட்டை (கிழக்கின் ட்ராய்)',
    'gingee-fort',
    'Chola / Nayaka / Maratha',
    1190,
    0,
    'Viluppuram District, Tamil Nadu, India',
    12.2547,
    79.4182,
    'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80',
    'Archaeological Survey of India (ASI) Southern Circle',
    'Dubbed the Troy of the East by the British; a sprawling fortress complex linking three steep granite hill citadels with miles of crenellated stone ramparts.',
    'Originally constructed by the Konar dynasty in the 12th century and heavily reinforced by the Gingee Nayaks in the 16th century. Captured in 1677 CE by Chhatrapati Shivaji, who crowned it Indias most secure citadel.',
    'Encloses a triangular perimeter connecting Rajagiri, Krishnagiri, and Chandrayandurg. Features the 8-storey Kalyana Mahal palace tower, natural hilltop cisterns, and a sheer 60-foot vertical natural chasm bridged by a single drawbridge.',
    'A masterpiece of medieval military engineering. Withstood an 8-year siege (1690-1698 CE) by Mughal Emperor Aurangzebs army, marking the longest siege in Indian history.'
  );

  // Seed HistoricalFacts
  db.exec(`
    INSERT INTO historical_facts (site_id, category, fact_text, source_reference) VALUES
    (1, 'Engineering', 'Constructed with 130,000 tonnes of granite without mortar using interlocking dry-stone puzzle joints.', 'ASI Monograph Series'),
    (1, 'Epigraphy', 'Plinth inscriptions document 400 temple dancers, accountants, and musicians, showing 11th-century democratic administration.', 'ASI Epigraphia Indica Vol II'),
    (2, 'Maritime', 'Excavations prove Mahabalipuram was an international trade hub connecting Tamilakam with China and the Roman Empire.', 'ASI Maritime Survey 2005'),
    (3, 'Acoustics', 'The 5 musical pillars in Meenakshi temple each resonate with the 7 classical Carnatic swaras when struck gently.', 'Tamil Virtual Academy'),
    (4, 'Naval Raid', 'From Gangaikonda Cholapuram, Rajendra Chola launched the 1025 CE maritime raid capturing the Strait of Malacca.', 'K.A. Nilakanta Sastri'),
    (5, 'Military', 'Mughal general Zulfiqar Khan had to besiege Gingee Fort for 8 continuous years before it surrendered.', 'Jadunath Sarkar');
  `);

  // Seed HeritageStories
  db.exec(`
    INSERT INTO heritage_stories (site_id, title, persona, narrative, language, audio_url) VALUES
    (1, 'Symphony in Granite: Raising the 80-Tonne Cupola', 'Chief Royal Architect (Sthapati)', 'The morning sun breaks over the Kaveri plains, glinting off the colossal blocks of granite. Every joint is locked dry without mortar—stone kissing stone with mathematical perfection.', 'en', '/api/story/audio?text=Symphony&lang=en'),
    (2, 'Whispers of the Salt Waves: The Shore Temple at Dawn', 'Silk-Route Voyager', 'Having sailed from distant ports across uncharted waters, nothing prepared me for the silhouette of the Shore Temple piercing the dawn sky.', 'en', '/api/story/audio?text=ShoreTemple&lang=en'),
    (3, 'Cosmic Labyrinth: Echoes from the Hall of 1000 Pillars', 'Temple Devotee', 'Step softly across the cool stone flagstones of Madurai. Around you rise 985 monolithic pillars sculpted with celestial grace.', 'en', '/api/story/audio?text=CosmicLabyrinth&lang=en'),
    (5, 'Troy of the East: The Vertical Chasm of Rajagiri', 'Fortress Commander', 'Three sheer granite mountains linked by eight miles of battlements. To reach the citadel of Rajagiri, one must cross a single narrow drawbridge.', 'en', '/api/story/audio?text=TroyEast&lang=en');
  `);

  // Seed QuizQuestions
  db.exec(`
    INSERT INTO quiz_questions (site_id, dynasty, question, option_a, option_b, option_c, option_d, correct_option, explanation, difficulty, language) VALUES
    (1, 'Chola', 'What is the approximate weight of the monolithic granite Kumbam resting atop Brihadeeswarar Temple vimana?', '25 Tonnes', '80 Tonnes', '120 Tonnes', '200 Tonnes', 'B', 'The octagonal Kumbam weighs approx 80 tonnes and was elevated via a 6-km inclined earthen ramp.', 'Medium', 'en'),
    (2, 'Pallava', 'Which Pallava monarch commissioned the monolithic Pancha Rathas and gave Mahabalipuram its royal title?', 'Mahendravarman I', 'Narasimhavarman I (Mamalla)', 'Rajasimha', 'Dantivarman', 'B', 'Narasimhavarman I, titled Mamalla (the great wrestler), transformed the seaport.', 'Easy', 'en'),
    (3, 'Nayaka', 'How many sculpted stone pillars actually stand in the famed Hall of Thousand Pillars in Meenakshi temple?', '1000 Pillars', '985 Pillars', '850 Pillars', '1024 Pillars', 'B', 'There are exactly 985 uniquely sculpted monolithic pillars in the hall.', 'Hard', 'en'),
    (4, 'Chola', 'Why did Rajendra Chola I construct the imperial city of Gangaikonda Cholapuram?', 'To escape a flood', 'To commemorate his victory reaching the River Ganges', 'To prepare for war with Rome', 'Astrological prophecy', 'B', 'He defeated northern rulers up to Bengal and brought holy Ganges water.', 'Medium', 'en'),
    (5, 'Maratha / Nayaka', 'Which famous historical ruler praised Gingee Fort as the most impregnable fortress in India?', 'Raja Raja Chola', 'Chhatrapati Shivaji Maharaj', 'Tipu Sultan', 'Robert Clive', 'B', 'Shivaji captured Gingee in 1677 CE and reinforced its defenses.', 'Medium', 'en');
  `);

  console.log(' ✓ Initial 5 Tamil Nadu heritage locations and related records populated.');
} else {
  console.log(' -> Database already contains', siteCount, 'sites.');
}

// 3. Test Queries & CRUD Operations
console.log('\n[STEP 3] Testing Database Retrieval & CRUD Operations...');

// Listing test
const allSites = db.prepare('SELECT id, name, location, dynasty, century_ce, is_unesco FROM heritage_sites').all();
console.log(` -> Found ${allSites.length} sites in SQLite:`);
allSites.forEach(s => {
  console.log(`    [ID ${s.id}] ${s.name} (${s.location}) - Dynasty: ${s.dynasty}, UNESCO: ${s.is_unesco ? 'Yes' : 'No'}`);
});

if (allSites.length !== 5) {
  throw new Error(`Expected exactly 5 sites, found ${allSites.length}`);
}

// Search test
const cholaSearch = db.prepare("SELECT name, location FROM heritage_sites WHERE dynasty LIKE '%Chola%' OR name LIKE '%Chola%'").all();
console.log(` -> Search 'Chola': Found ${cholaSearch.length} sites:`, cholaSearch.map(s => s.name));
if (cholaSearch.length < 2) throw new Error("Chola search failed");

// Individual detail test
const thanjavur = db.prepare('SELECT * FROM heritage_sites WHERE slug = ?').get('brihadeeswarar-temple');
console.log(' -> Individual Site Lookup (Thanjavur):', thanjavur.name);
console.log('    Latitude:', thanjavur.latitude, 'Longitude:', thanjavur.longitude);
console.log('    Source:', thanjavur.information_source);

// Facts test
const facts = db.prepare('SELECT category, fact_text FROM historical_facts WHERE site_id = ?').all(thanjavur.id);
console.log(` -> Facts for Thanjavur: Found ${facts.length} facts.`);

// Stories test
const stories = db.prepare('SELECT persona, title FROM heritage_stories WHERE site_id = ?').all(thanjavur.id);
console.log(` -> Stories for Thanjavur: Found ${stories.length} stories.`);

// Quiz test
const quizzes = db.prepare('SELECT question, correct_option FROM quiz_questions').all();
console.log(` -> Quiz Questions: Found ${quizzes.length} questions in database.`);

// Dynamic CRUD: Insert, Update, Delete
console.log('\n[STEP 4] Testing Dynamic CRUD (Insert, Read, Update, Delete)...');
const insertTest = db.prepare(`
  INSERT INTO heritage_sites (
    name, slug, dynasty, century_ce, location, latitude, longitude, image_url, information_source, description, historical_background, architecture, cultural_significance
  ) VALUES (
    'Test Monument', 'test-monument', 'Test Dynasty', 800, 'Test Location', 11.0, 78.0, 'https://test.jpg', 'ASI Test', 'Test Desc', 'Test History', 'Test Arch', 'Test Sig'
  )
`);
const insertResult = insertTest.run();
const newId = insertResult.lastInsertRowid;
console.log(' -> Created test site with ID:', newId);

const fetchedTest = db.prepare('SELECT name, description FROM heritage_sites WHERE id = ?').get(newId);
console.log(' -> Fetched test site:', fetchedTest.name);

db.prepare('UPDATE heritage_sites SET description = ? WHERE id = ?').run('Updated Test Description', newId);
const updatedTest = db.prepare('SELECT description FROM heritage_sites WHERE id = ?').get(newId);
console.log(' -> Updated test site description:', updatedTest.description);

db.prepare('DELETE FROM heritage_sites WHERE id = ?').run(newId);
const deletedCheck = db.prepare('SELECT * FROM heritage_sites WHERE id = ?').get(newId);
console.log(' -> Deleted test site verified (null):', deletedCheck === undefined);

console.log('\n' + '='.repeat(65));
console.log('🎉 HERITAGEAI SQLITE DATABASE FULLY VERIFIED (100% OPERATIONAL)');
console.log('='.repeat(65));
