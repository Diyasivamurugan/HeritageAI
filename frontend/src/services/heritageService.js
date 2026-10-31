import { request } from './api';

export const FALLBACK_MONUMENTS = [
  {
    id: 1,
    slug: "brihadeeswarar-temple",
    name_en: "Brihadeeswarar Temple (Peruvudaiyar Kovil)",
    name_ta: "பெருவுடையார் கோயில் (தஞ்சைப் பெரிய கோயில்)",
    dynasty: "Chola",
    built_by_en: "Arulmozhivarman (Raja Raja Chola I)",
    built_by_ta: "அருள்மொழிவர்மன் (முதலாம் இராஜராஜ சோழன்)",
    century_ce: 1010,
    period: "11th Century CE (Completed in 1010 CE)",
    district: "Thanjavur",
    state: "Tamil Nadu",
    latitude: 10.7828,
    longitude: 79.1318,
    is_unesco: true,
    architectural_style_en: "Dravidian Granite Architecture (Chola Grandeur)",
    architectural_style_ta: "திராவிட கருங்கல் கட்டிடக்கலை (சோழர் கால பொற்கலை)",
    hero_image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80",
    short_desc_en: "A masterpiece of Chola architecture and one of the Great Living Chola Temples, built entirely of interlocking granite with a 216-foot vimana.",
    short_desc_ta: "சோழர் கட்டிடக்கலையின் மணிமகுடம். 216 அடி உயரமுடைய, முழுவதும் கருங்கல்லால் மட்டுமே இணைக்கப்பட்ட உலகப் புகழ்பெற்ற யுனெஸ்கோ மரபுச் சின்னம்.",
    full_history_en: "Commissioned by the great Chola Emperor Raja Raja Chola I in 1003 CE and consecrated in 1010 CE to celebrate his military conquests and deep devotion to Lord Shiva. Constructed without binding mortar using an interlocking puzzle system, the temple required transporting over 130,000 tonnes of granite from quarries over 50 kilometers away.",
    full_history_ta: "முதலாம் இராஜராஜ சோழனால் கி.பி. 1003-ல் தொடங்கப்பட்டு கி.பி. 1010-ல் குடமுழுக்கு செய்யப்பட்டது. 50 கி.மீ தூரத்திலிருந்து 1,30,000 டன் கருங்கற்கள் நதி வழியே கொண்டுவரப்பட்டு, எந்தவொரு சாந்துப் பூச்சும் இன்றி ஒன்றுடன் ஒன்று பிணைக்கப்பட்ட உன்னதப் பொறியியல் அதிசயம்.",
    significance_en: "Recognized as a UNESCO World Heritage site, it remains one of the tallest granite temple vimanas in the world with an 80-tonne monolithic cupola atop its summit.",
    significance_ta: "யுனெஸ்கோ உலக பாரம்பரியக் களம். 80 டன் எடை கொண்ட ஒற்றைக்கல் விமானக் கலசத்தை உச்சிக்கு ஏற்றிய சோழர் காலப் பொறியியல் வியப்பு உலகையே வியக்க வைக்கிறது.",
    highlights: [
      {
        id: 101,
        title_en: "The 80-Tonne Monolithic Kumbam",
        title_ta: "80 டன் ஒற்றைக்கல் சிகரக் கலசம்",
        description_en: "The octagonal cupola dome resting atop the 216-foot vimana was carved from a single granite block weighing approximately 80 tonnes, hoisted up an estimated 6-kilometer earthen ramp.",
        description_ta: "216 அடி உயர கோபுரத்தின் உச்சியில் உள்ள எண்கோண கலசம் சுமார் 80 டன் எடையுள்ள ஒரே பாறையிலிருந்து செதுக்கப்பட்டு சாய்வு தளம் மூலம் ஏற்றப்பட்டது.",
        image_url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
      },
      {
        id: 102,
        title_en: "Monolithic Nandi Pavilion",
        title_ta: "ஒற்றைக்கல் பிரம்மாண்ட நந்தி",
        description_en: "Guarding the sanctum is a colossal monolithic Nandi, measuring 12 feet in height, 19.5 feet in length, carved out of a single block of stone weighing over 25 tonnes.",
        description_ta: "கருவறைக்கு முன்பாக 12 அடி உயரமும், 19.5 அடி நீளமும் கொண்ட ஒற்றைக்கல் நந்தி கம்பீரமாக வீற்றிருக்கிறது.",
        image_url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80"
      }
    ],
    facts: [
      {
        id: 1,
        category: "Epigraphy",
        fact_en: "The temple walls preserve over 100 inscriptions documenting names of barbers, cooks, drummers, and sculptors, showing democratic transparency in 11th-century Chola administration.",
        fact_ta: "கோவில் சுவர்களில் உள்ள கல்வெட்டுகள் கலைஞர்கள், சமையல்காரர்கள் மற்றும் மேளக்காரர்களின் பெயர்களைப் பதிவு செய்து மன்னரின் வெளிப்படையான நிர்வாகத்தை காட்டுகின்றன.",
        citation: "ASI Epigraphia Indica Vol II"
      }
    ]
  },
  {
    id: 2,
    slug: "mahabalipuram-monuments",
    name_en: "Group of Monuments at Mahabalipuram",
    name_ta: "மாமல்லபுரக் குடைவரைக் கோயில்கள் மற்றும் சிற்பங்கள்",
    dynasty: "Pallava",
    built_by_en: "Mahendravarman I & Narasimhavarman I (Mamalla)",
    built_by_ta: "முதலாம் மகேந்திரவர்மன் மற்றும் மாமல்லன் நரசிம்மவர்மன்",
    century_ce: 650,
    period: "7th – 8th Century CE",
    district: "Chengalpattu",
    state: "Tamil Nadu",
    latitude: 12.6269,
    longitude: 80.1927,
    is_unesco: true,
    architectural_style_en: "Rock-cut Monolithic Pallava Architecture",
    architectural_style_ta: "பல்லவர் கால ஒற்றைக்கல் குடைவரை சிற்பக்கலை",
    hero_image: "https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80",
    short_desc_en: "Ancient seaport of the Pallava dynasty known for open-air rock bas-reliefs, monolithic rathas, cave sanctuaries, and the oceanic Shore Temple.",
    short_desc_ta: "பல்லவப் பேரரசின் பண்டைய துறைமுக நகரம். கடற்கரை கோவில், பஞ்ச பாண்டவ ரதங்கள், மற்றும் உலகின் மிகப்பெரிய திறந்தவெளி புடைப்புச் சிற்பங்களுக்குப் பெயர் பெற்றது.",
    full_history_en: "Flourishing as a major merchant hub connecting ancient Tamilakam with Sri Lanka, Java, Cambodia, and the Roman Empire. During the reign of Narasimhavarman I (Mamalla), master artisans transformed standing boulders into intricate shrines, mimicking wooden chariot pavilions (Rathas).",
    full_history_ta: "பல்லவ மன்னன் மாமல்லன் நரசிம்மவர்மனால் உலகப்புகழ் பெற்ற துறைமுகமாகவும் சிற்பக்கூடமாகவும் உருவாக்கப்பட்டது. சீனப் பயணி யுவான் சுவாங் இந்நகரை நேரில் கண்டு வியந்து பதிவு செய்துள்ளார்.",
    significance_en: "UNESCO World Heritage Monument inscribed in 1984. Contains 'Descent of the Ganges' (Arjuna's Penance), one of the largest open-air stone bas-reliefs on Earth.",
    significance_ta: "1984-ல் யுனெஸ்கோவால் அங்கீகரிக்கப்பட்டது. 'பகீரதன் தவம்' (அர்ச்சுனன் தவம்) சிற்பம் உலகின் மிகப்பெரிய திறந்தவெளி பாறைச் சிற்பங்களில் ஒன்றாகும்.",
    highlights: [
      {
        id: 201,
        title_en: "Pancha Rathas (Five Chariots)",
        title_ta: "பஞ்ச பாண்டவ ரதங்கள்",
        description_en: "Five monolithic pavilions named after the Pandavas and Draupadi, each carved out of a single whale-back granite rock.",
        description_ta: "ஒரே பாறையிலிருந்து செதுக்கப்பட்ட ஐந்து தனித்துவமான தேர் வடிவ குடைவரைக் கோயில்கள்.",
        image_url: "https://images.unsplash.com/photo-1621847468516-1ed5d0df56fe?auto=format&fit=crop&w=800&q=80"
      }
    ],
    facts: [
      {
        id: 2,
        category: "Maritime Trade",
        fact_en: "Chinese, Roman, and Sasanian coins excavated at Mamallapuram verify it as a premier ancient maritime gateway to South-East Asia.",
        fact_ta: "இங்கு கண்டெடுக்கப்பட்ட சீன, உரோமானிய நாணயங்கள் மாமல்லபுரம் ஆசியாவின் முக்கிய சர்வதேச வர்த்தகத் துறைமுகமாக விளங்கியதை நிரூபிக்கின்றன.",
        citation: "ASI Maritime Heritage Report 2005"
      }
    ]
  },
  {
    id: 3,
    slug: "meenakshi-amman-temple",
    name_en: "Meenakshi Sundareswarar Temple",
    name_ta: "மதுரை மீனாட்சி சுந்தரேசுவரர் திருக்கோயில்",
    dynasty: "Pandya & Nayaka",
    built_by_en: "Early Pandyas; Expanded by Viswanatha & Thirumalai Nayak",
    built_by_ta: "பண்டைய பாண்டியர்; விரிவாக்கம்: விஸ்வநாத மற்றும் திருமலை நாயக்கர்",
    century_ce: 1200,
    period: "Rebuilt 16th – 17th Century CE",
    district: "Madurai",
    state: "Tamil Nadu",
    latitude: 9.9195,
    longitude: 78.1193,
    is_unesco: false,
    architectural_style_en: "Late Dravidian Nayaka Architecture with Polychrome Gopurams",
    architectural_style_ta: "வண்ணமயமான வானளாவிய கோபுரங்களுடன் கூடிய நாயக்கர் கால திராவிடக்கலை",
    hero_image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
    short_desc_en: "The spiritual heart of Madurai, famous for 14 soaring gopurams encrusted with thousands of stucco deities, the Hall of 1000 Pillars, and the Golden Lotus Tank.",
    short_desc_ta: "தூங்கா நகரமான மதுரையின் இதயத்துடிப்பு. 14 விண்ணைமுட்டும் ராஜகோபுரங்கள், ஆயிரங்கால் மண்டபம், பொற்றாமரைக் குளம் கொண்ட வரலாற்றுத் திருத்தலம்.",
    full_history_en: "Madurai is one of the world's continuously inhabited ancient cities, celebrated in Sangam literature. Dedicate to Goddess Meenakshi and Lord Sundareswarar, the temple was splendidly restored and expanded under the Madurai Nayak dynasty between 1560 and 1650 CE.",
    full_history_ta: "சங்க இலக்கியங்களில் போற்றப்படும் இரண்டாயிரம் ஆண்டுகளுக்கும் மேலான தொன்மை வாய்ந்த நகரம் மதுரை. 16 மற்றும் 17-ஆம் நூற்றாண்டுகளில் மதுரை நாயக்க மன்னர்களால் மாபெரும் கலைக் கூடமாக நிர்மாணிக்கப்பட்டது.",
    significance_en: "Houses the famous Hall of Thousand Pillars (Ayiram Kaal Mandapam) displaying 985 exquisitely sculpted pillars and musical stone pillars.",
    significance_ta: "985 நுணுக்கமாக செதுக்கப்பட்ட தூண்களையும், தட்டினால் இசை எழும்பும் இசைத் தூண்களையும் கொண்ட ஆயிரங்கால் மண்டபம் இதன் மணிமகுடம்.",
    highlights: [
      {
        id: 301,
        title_en: "Hall of Thousand Pillars",
        title_ta: "ஆயிரங்கால் மண்டபம்",
        description_en: "Built in 1569 by Ariyanatha Mudaliar, featuring 985 uniquely carved monolithic pillars that form straight lines from every optical angle.",
        description_ta: "1569-ல் அரியநாத முதலியாரால் கட்டப்பட்டது. எந்தக் கோணத்தில் பார்த்தாலும் நேர்க்கோட்டில் காட்சியளிக்கும் 985 சிற்பத் தூண்கள்.",
        image_url: "https://images.unsplash.com/photo-1596707325996-3c07e0340b10?auto=format&fit=crop&w=800&q=80"
      }
    ],
    facts: [
      {
        id: 3,
        category: "Matrilineal Heritage",
        fact_en: "Goddess Meenakshi is worshiped first before Lord Sundareswarar, reflecting ancient Dravidian matrilineal traditions.",
        fact_ta: "முதலில் மீனாட்சி அம்மனை வணங்கிய பிறகே சுந்தரேசுவரரை வணங்குவது மரபு. இது பண்டைய தமிழ் சமூகத்தின் தாய்வழிச் சிறப்பைக் குறிக்கிறது.",
        citation: "Tamil Virtual Academy Archives"
      }
    ]
  },
  {
    id: 4,
    slug: "gangaikonda-cholapuram",
    name_en: "Brihadisvara Temple, Gangaikonda Cholapuram",
    name_ta: "கங்கைகொண்ட சோழபுரம் பெருவுடையார் கோயில்",
    dynasty: "Chola",
    built_by_en: "Rajendra Chola I (Gangaikondan)",
    built_by_ta: "முதலாம் இராஜேந்திர சோழன் (கங்கைகொண்டான்)",
    century_ce: 1035,
    period: "11th Century CE (Completed in 1035 CE)",
    district: "Ariyalur",
    state: "Tamil Nadu",
    latitude: 11.2057,
    longitude: 79.4526,
    is_unesco: true,
    architectural_style_en: "Chola Dravidian Architecture with Feminine Grace Curves",
    architectural_style_ta: "மென்மையான வளைவுகளுடன் கூடிய உன்னத சோழர் திராவிடக்கலை",
    hero_image: "https://images.unsplash.com/photo-1622396481304-4ad4901ff0f4?auto=format&fit=crop&w=1200&q=80",
    short_desc_en: "The royal capital built by Rajendra Chola I after victorious military expeditions to the River Ganges and South-East Asia.",
    short_desc_ta: "கங்கை நதி வரை சென்று வெற்றி கொண்ட முதலாம் இராஜேந்திர சோழனால் உருவாக்கப்பட்ட சோழப் பேரரசின் தலைநகரக் கோயில்.",
    full_history_en: "Following his unprecedented naval and land expedition across the subcontinent all the way to Bengal and the sacred Ganges river, Rajendra Chola I founded this new imperial capital. The vimana rises to 182 feet with graceful concave curves.",
    full_history_ta: "வடஇந்தியப் படையெடுப்பில் கங்கை வரை சென்று வெற்றி பெற்று திரும்பிய முதலாம் இராஜேந்திர சோழன், கங்கை நீரைக் கொண்டுவந்து தலைநகரையும் 182 அடி உயர விமானத்தையும் நிர்மாணித்தான்.",
    significance_en: "Part of the UNESCO Great Living Chola Temples. Renowned for supreme stone sculptures, including the relief of Shiva crowning Rajendra Chola.",
    significance_ta: "யுனெஸ்கோ உலக மரபுச் சின்னம். சிவபெருமான் இராஜேந்திர சோழனுக்கு மாலை சூட்டி அருளும் 'சண்டேச அனுக்கிரக மூர்த்தி' சிற்பம் உலகப்புகழ் பெற்றது.",
    highlights: [
      {
        id: 401,
        title_en: "Simhakinaru (The Lion Well)",
        title_ta: "சிங்கமுகக் கிணறு",
        description_en: "A massive open well entered through the roaring mouth of a carved stone lion, constructed to receive consecration waters.",
        description_ta: "சிங்கத்தின் வாய்க்குள் படிக்கட்டுகள் வழியே இறங்கிச் செல்லும் பிரம்மாண்ட புனிதக் கிணறு.",
        image_url: "https://images.unsplash.com/photo-1622396481304-4ad4901ff0f4?auto=format&fit=crop&w=800&q=80"
      }
    ],
    facts: [
      {
        id: 4,
        category: "Naval Conquest",
        fact_en: "From this capital city, Rajendra Chola launched the 1025 CE maritime raid controlling the Strait of Malacca.",
        fact_ta: "இந்தத் தலைநகரிலிருந்தே இராஜேந்திர சோழன் மலேசியா, இந்தோனேசியா மீது கடல்வழிப் படையெடுத்து வெற்றி பெற்றான்.",
        citation: "K.A. Nilakanta Sastri, 'The Colas'"
      }
    ]
  },
  {
    id: 5,
    slug: "gingee-fort",
    name_en: "Gingee Fort (Senji Durgam)",
    name_ta: "செஞ்சிக் கோட்டை (கிழக்கின் ட்ராய்)",
    dynasty: "Chola / Nayaka / Maratha",
    built_by_en: "Ananta Kon; fortified by Krishnappa Nayak & Shivaji Maharaj",
    built_by_ta: "ஆனந்த கோன்; விரிவாக்கம்: கிருஷ்ணப்ப நாயக்கர் மற்றும் சத்ரபதி சிவாஜி",
    century_ce: 1190,
    period: "12th – 17th Century CE",
    district: "Viluppuram",
    state: "Tamil Nadu",
    latitude: 12.2547,
    longitude: 79.4182,
    is_unesco: false,
    architectural_style_en: "Impregnable Hill Citadel & Military Fortification Architecture",
    architectural_style_ta: "இயற்கை மலைக் குன்றுகளுடன் இணைந்த பிரம்மாண்ட போர்க்கோட்டைக் கலை",
    hero_image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
    short_desc_en: "Hailed as the 'Troy of the East' by the British; a sprawling fortress complex linking three steep granite hills with miles of ramparts.",
    short_desc_ta: "ஆங்கிலேயர்களால் 'கிழக்கின் ட்ராய்' என்று வர்ணிக்கப்பட்ட, மூன்று செங்குத்தான மலைகளை இணைத்து கட்டப்பட்ட வெல்ல முடியாத கோட்டை.",
    full_history_en: "Originally built by the Konar dynasty in the 12th century, Gingee was transformed into an impenetrable fortress by the Gingee Nayaks and later Marathas. Chhatrapati Shivaji praised it as the most secure fort in India.",
    full_history_ta: "12-ஆம் நூற்றாண்டில் தொடங்கி 16-ஆம் நூற்றாண்டில் பலப்படுத்தப்பட்டது. ராஜகிரி, கிருஷ்ணகிரி, சந்திராயன்துர்க் ஆகிய 3 மலைகளை 13 கி.மீ நீள மதில்சுவர்கள் இணைக்கின்றன. சத்ரபதி சிவாஜியால் பெரிதும் போற்றப்பட்டது.",
    significance_en: "Features the 8-storey Kalyana Mahal palace tower, massive granaries, and a sheer vertical chasm with a single drawbridge at Rajagiri.",
    significance_ta: "எட்டு அடுக்குகள் கொண்ட கல்யாண மஹால் மற்றும் ராணுவ வியூகங்களின் சங்கமம்.",
    highlights: [
      {
        id: 501,
        title_en: "Kalyana Mahal (Palace Tower)",
        title_ta: "கல்யாண மஹால்",
        description_en: "An 8-storey octagonal tower showcasing Indo-Saracenic arches, royal courtyards, and ancient terracotta piped water distribution.",
        description_ta: "இந்து-இஸ்லாமிய பாணியில் கட்டப்பட்ட எட்டு மாடி அரண்மனை கோபுரம்.",
        image_url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
      }
    ],
    facts: [
      {
        id: 5,
        category: "Siege Record",
        fact_en: "Mughal Emperor Aurangzeb's army had to lay siege for 8 full years (1690–1698 CE) before Gingee fell.",
        fact_ta: "ஔரங்கசீப்பின் படை செஞ்சியைக் கைப்பற்ற தொடர்ந்து 8 ஆண்டுகள் முற்றுகை இட வேண்டியிருந்தது.",
        citation: "Jadunath Sarkar, 'History of Aurangzib'"
      }
    ]
  }
];

export async function fetchMonuments(filters = {}) {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.dynasty && filters.dynasty !== 'all') params.append('dynasty', filters.dynasty);
  if (filters.is_unesco !== undefined) params.append('is_unesco', filters.is_unesco);

  const endpoint = `/api/heritage?${params.toString()}`;
  const data = await request(endpoint);
  
  if (data && Array.isArray(data)) {
    return data;
  }

  // Fallback filter
  let result = [...FALLBACK_MONUMENTS];
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(m => 
      m.name_en.toLowerCase().includes(q) ||
      m.name_ta.includes(q) ||
      m.dynasty.toLowerCase().includes(q) ||
      m.district.toLowerCase().includes(q)
    );
  }
  if (filters.dynasty && filters.dynasty !== 'all') {
    result = result.filter(m => m.dynasty.toLowerCase().includes(filters.dynasty.toLowerCase()));
  }
  return result;
}

export async function fetchMonumentBySlugOrId(slugOrId) {
  const data = await request(`/api/heritage/${slugOrId}`);
  if (data) return data;

  // Fallback lookup
  return FALLBACK_MONUMENTS.find(m => m.slug === slugOrId || String(m.id) === String(slugOrId)) || FALLBACK_MONUMENTS[0];
}
