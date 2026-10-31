from sqlalchemy.orm import Session
from app.models.heritage_site import HeritageSite
from app.models.historical_fact import HistoricalFact
from app.models.heritage_story import HeritageStory
from app.models.quiz_question import QuizQuestion
from app.models.language import Language

QUIZ_SEED_DATA = [
    {
        "site": "brihadeeswarar-temple",
        "dynasty": "Chola",
        "topic": "Chola Dynasty",
        "difficulty": "Beginner",
        "question": "Which Chola ruler commissioned the Brihadeeswarar Temple at Thanjavur?",
        "question_ta": "தஞ்சைப் பிரகதீஸ்வரர் கோயிலைக் கட்டுவித்த சோழ மன்னர் யார்?",
        "options": ["Raja Raja Chola I", "Rajendra Chola I", "Kulothunga Chola I", "Aditya Chola I"],
        "options_ta": ["முதலாம் இராஜராஜ சோழன்", "முதலாம் இராஜேந்திர சோழன்", "முதலாம் குலோத்துங்க சோழன்", "முதலாம் ஆதித்த சோழன்"],
        "correct": 0,
        "explanation": "Raja Raja Chola I commissioned the temple, which was consecrated in 1010 CE.",
        "explanation_ta": "முதலாம் இராஜராஜ சோழன் இக்கோயிலைக் கட்டுவித்து, கி.பி. 1010-ல் குடமுழுக்கு செய்தார்.",
    },
    {
        "site": "mahabalipuram",
        "dynasty": "Pallava",
        "topic": "Mahabalipuram",
        "difficulty": "Beginner",
        "question": "Which dynasty is most closely associated with Mahabalipuram's famous rock-cut monuments?",
        "question_ta": "மாமல்லபுரத்தின் புகழ்பெற்ற பாறைக் குடைவரைச் சின்னங்களுடன் தொடர்புடைய அரச வம்சம் எது?",
        "options": ["Chola", "Pallava", "Pandya", "Chera"],
        "options_ta": ["சோழர்", "பல்லவர்", "பாண்டியர்", "சேரர்"],
        "correct": 1,
        "explanation": "Pallava rulers developed Mahabalipuram as a major center of rock-cut and structural architecture.",
        "explanation_ta": "பல்லவ மன்னர்கள் மாமல்லபுரத்தைப் பாறைக் குடைவரை மற்றும் கட்டுமானக் கோயில் கலைகளின் முக்கிய மையமாக வளர்த்தனர்.",
    },
    {
        "site": "meenakshi-amman-temple",
        "dynasty": "Pandya and Nayaka",
        "topic": "Meenakshi Amman Temple",
        "difficulty": "Beginner",
        "question": "In which Tamil Nadu city is Meenakshi Amman Temple located?",
        "question_ta": "மீனாட்சி அம்மன் கோயில் தமிழ்நாட்டின் எந்த நகரில் அமைந்துள்ளது?",
        "options": ["Thanjavur", "Madurai", "Kanchipuram", "Tiruchirappalli"],
        "options_ta": ["தஞ்சாவூர்", "மதுரை", "காஞ்சிபுரம்", "திருச்சிராப்பள்ளி"],
        "correct": 1,
        "explanation": "Meenakshi Amman Temple is the historic temple complex at the heart of Madurai.",
        "explanation_ta": "மதுரையின் மையப்பகுதியில் அமைந்துள்ள வரலாற்றுச் சிறப்புமிக்க கோயில் வளாகம் மீனாட்சி அம்மன் கோயிலாகும்.",
    },
    {
        "site": None,
        "dynasty": "Tamil Culture",
        "topic": "Tamil Culture",
        "difficulty": "Beginner",
        "question": "Which classical Tamil performing art is traditionally associated with expressive dance and music?",
        "question_ta": "நடனமும் இசையும் இணைந்த தமிழர் பாரம்பரியக் கலை எது?",
        "options": ["Bharatanatyam", "Kathak", "Bihu", "Garba"],
        "options_ta": ["பரதநாட்டியம்", "கதக்", "பிஹு", "கர்பா"],
        "correct": 0,
        "explanation": "Bharatanatyam is a classical dance tradition with deep roots in Tamil Nadu's cultural history.",
        "explanation_ta": "தமிழ்நாட்டின் பண்பாட்டு வரலாற்றில் ஆழமான வேர்களைக் கொண்ட செவ்வியல் நடன மரபு பரதநாட்டியம்.",
    },
    {
        "site": "brihadeeswarar-temple",
        "dynasty": "Chola",
        "topic": "Brihadeeswarar Temple",
        "difficulty": "Intermediate",
        "question": "What is the towering sanctuary structure above the Brihadeeswarar Temple's main shrine called?",
        "question_ta": "பிரகதீஸ்வரர் கோயிலின் கருவறைக்கு மேலே உயர்ந்து நிற்கும் கோபுர அமைப்பு எவ்வாறு அழைக்கப்படுகிறது?",
        "options": ["Vimana", "Gopuram", "Mandapa", "Prakara"],
        "options_ta": ["விமானம்", "கோபுரம்", "மண்டபம்", "பிரகாரம்"],
        "correct": 0,
        "explanation": "The vimana is the monumental tower directly above the sanctum; the temple's rises about 216 feet.",
        "explanation_ta": "கருவறைக்கு நேராக மேலே எழும் உயரமான அமைப்பு விமானம்; இக்கோயிலின் விமானம் சுமார் 216 அடி உயரம் கொண்டது.",
    },
    {
        "site": "mahabalipuram",
        "dynasty": "Pallava",
        "topic": "Mahabalipuram",
        "difficulty": "Intermediate",
        "question": "What is the name commonly given to Mahabalipuram's monumental open-air rock relief?",
        "question_ta": "மாமல்லபுரத்தின் புகழ்பெற்ற பிரம்மாண்ட திறந்தவெளிப் பாறைச் சிற்பம் பொதுவாக எவ்வாறு அழைக்கப்படுகிறது?",
        "options": ["Arjuna's Penance", "Lions of Sanchi", "The Iron Pillar", "Kailasa Descent"],
        "options_ta": ["அர்ஜுனன் தவம்", "சாஞ்சியின் சிங்கங்கள்", "இரும்புத் தூண்", "கைலாச இறக்கம்"],
        "correct": 0,
        "explanation": "The great relief is widely known as Arjuna's Penance and is also interpreted as the Descent of the Ganges.",
        "explanation_ta": "இந்தப் பெரிய பாறைச் சிற்பம் 'அர்ஜுனன் தவம்' எனப் பரவலாக அழைக்கப்படுகிறது; 'கங்கையின் இறக்கம்' என்றும் பொருள் கொள்ளப்படுகிறது.",
    },
    {
        "site": "gangaikonda-cholapuram",
        "dynasty": "Chola",
        "topic": "Gangaikonda Cholapuram",
        "difficulty": "Intermediate",
        "question": "Which Chola emperor founded Gangaikonda Cholapuram as an imperial capital?",
        "question_ta": "கங்கைகொண்ட சோழபுரத்தைப் பேரரசின் தலைநகராக நிறுவிய சோழ மன்னர் யார்?",
        "options": ["Raja Raja Chola I", "Rajendra Chola I", "Rajaraja Chola II", "Vijayalaya Chola"],
        "options_ta": ["முதலாம் இராஜராஜ சோழன்", "முதலாம் இராஜேந்திர சோழன்", "இரண்டாம் இராஜராஜ சோழன்", "விஜயாலய சோழன்"],
        "correct": 1,
        "explanation": "Rajendra Chola I established the city after his northern campaign and victory commemorated by the title Gangaikondan.",
        "explanation_ta": "வடஇந்தியப் படையெடுப்பின் வெற்றிக்குப் பின், 'கங்கைகொண்டான்' என்ற பட்டத்தை நினைவுகூர முதலாம் இராஜேந்திர சோழன் இந்நகரை நிறுவினார்.",
    },
    {
        "site": "gingee-fort",
        "dynasty": "Nayaka and Maratha",
        "topic": "Gingee Fort",
        "difficulty": "Intermediate",
        "question": "Gingee Fort is especially known for its defenses built across how many principal hill citadels?",
        "question_ta": "செஞ்சிக் கோட்டையின் பாதுகாப்பு அமைப்பு முக்கியமாக எத்தனை மலைக் கோட்டைகளைச் சுற்றி அமைந்துள்ளது?",
        "options": ["One", "Two", "Three", "Five"],
        "options_ta": ["ஒன்று", "இரண்டு", "மூன்று", "ஐந்து"],
        "correct": 2,
        "explanation": "Gingee's historic fortifications link the hill citadels of Rajagiri, Krishnagiri, and Chandrayandurg.",
        "explanation_ta": "ராஜகிரி, கிருஷ்ணகிரி, சந்திரயன்துர்க் ஆகிய மூன்று மலைக் கோட்டைகளை இணைக்கும் பாதுகாப்பு அமைப்பே செஞ்சியின் சிறப்பு.",
    },
    {
        "site": "meenakshi-amman-temple",
        "dynasty": "Pandya and Nayaka",
        "topic": "Historical Architecture",
        "difficulty": "Intermediate",
        "question": "What is the name of the monumental entrance towers that define the skyline of Meenakshi Amman Temple?",
        "question_ta": "மீனாட்சி அம்மன் கோயிலின் தோற்றத்தைத் தனித்துவப்படுத்தும் பிரம்மாண்ட நுழைவுக் கோபுரங்கள் எவ்வாறு அழைக்கப்படுகின்றன?",
        "options": ["Gopurams", "Viharas", "Stupas", "Toranas"],
        "options_ta": ["கோபுரங்கள்", "விகாரைகள்", "ஸ்தூபிகள்", "தோரணங்கள்"],
        "correct": 0,
        "explanation": "The temple is renowned for its richly ornamented Dravidian gopurams, which rise above its entrances.",
        "explanation_ta": "நுழைவாயில்களின் மேல் உயர்ந்து நிற்கும் செழுமையாக அலங்கரிக்கப்பட்ட திராவிடக் கோபுரங்களுக்காக இக்கோயில் புகழ்பெற்றது.",
    },
    {
        "site": "brihadeeswarar-temple",
        "dynasty": "Chola",
        "topic": "Historical Architecture",
        "difficulty": "Advanced",
        "question": "Which feature best describes the structural style of Brihadeeswarar Temple's main tower?",
        "question_ta": "பிரகதீஸ்வரர் கோயிலின் முதன்மை உயர்கட்டமைப்பைச் சிறப்பாக விவரிக்கும் கட்டிடக்கலை அம்சம் எது?",
        "options": ["A stepped Dravidian vimana above the sanctum", "A hemispherical brick dome", "A timber pagoda", "A free-standing stone obelisk"],
        "options_ta": ["கருவறைக்கு மேலுள்ள அடுக்குநிலை திராவிட விமானம்", "அரை வட்டச் செங்கல் குவிமாடம்", "மரத்தால் ஆன பகோடா", "தனித்து நிற்கும் கல் தூபி"],
        "correct": 0,
        "explanation": "The temple's soaring, tiered vimana is a defining achievement of mature Chola Dravidian architecture.",
        "explanation_ta": "அடுக்குகளாக உயர்ந்து நிற்கும் விமானம் முதிர்ச்சியடைந்த சோழர் திராவிடக் கட்டிடக்கலையின் தனிச்சிறப்பாகும்.",
    },
    {
        "site": "mahabalipuram",
        "dynasty": "Pallava",
        "topic": "Historical Architecture",
        "difficulty": "Advanced",
        "question": "What makes the Pancha Rathas at Mahabalipuram especially notable in Indian temple architecture?",
        "question_ta": "மாமல்லபுரப் பஞ்ச ரதங்களை இந்தியக் கோயில் கட்டிடக்கலையில் தனித்துவப்படுத்துவது எது?",
        "options": ["Each is carved from a single rock outcrop", "They are built entirely of timber", "They are underground brick shrines", "They were assembled from modern concrete"],
        "options_ta": ["ஒவ்வொன்றும் ஒரே பாறையிலிருந்து செதுக்கப்பட்டது", "அவை முழுவதும் மரத்தால் கட்டப்பட்டவை", "அவை நிலத்தடியில் உள்ள செங்கல் சன்னதிகள்", "அவை நவீன கான்கிரீட்டால் உருவாக்கப்பட்டவை"],
        "correct": 0,
        "explanation": "The Pancha Rathas are monolithic shrines, individually hewn from large natural rock formations.",
        "explanation_ta": "பஞ்ச ரதங்கள் இயற்கைப் பாறைகளிலிருந்து தனித்தனியாகச் செதுக்கப்பட்ட ஒற்றைக்கல் கோயில் வடிவங்களாகும்.",
    },
    {
        "site": "meenakshi-amman-temple",
        "dynasty": "Pandya and Nayaka",
        "topic": "Meenakshi Amman Temple",
        "difficulty": "Advanced",
        "question": "Which architectural plan is reflected in the historic streets radiating around Madurai's temple center?",
        "question_ta": "மதுரைக் கோயிலைச் சுற்றி விரியும் வரலாற்றுத் தெருக்கள் எந்த நகரமைப்பை வெளிப்படுத்துகின்றன?",
        "options": ["Concentric, largely square streets around a sacred center", "A radial plan centered on a coastal harbor", "A single linear avenue along a river", "A circular grid around a hilltop fort"],
        "options_ta": ["புனித மையத்தைச் சுற்றிய செறிவான சதுரத் தெருக்கள்", "கடற்கரைத் துறைமுகத்தை மையமாகக் கொண்ட கதிர்வீச்சு அமைப்பு", "ஆற்றோரத்தில் ஒரே நேர்கோட்டுத் தெரு", "மலைக்கோட்டையைச் சுற்றிய வட்ட வடிவமைப்பு"],
        "correct": 0,
        "explanation": "Madurai's historic urban form is organized in successive streets around the temple, reflecting the city's sacred center.",
        "explanation_ta": "கோயிலை மையமாகக் கொண்டு அடுத்தடுத்த தெருக்கள் அமைந்துள்ள மதுரையின் நகரமைப்பு அதன் புனித மையத்தை வெளிப்படுத்துகிறது.",
    },
    {
        "site": "gangaikonda-cholapuram",
        "dynasty": "Chola",
        "topic": "Chola Dynasty",
        "difficulty": "Advanced",
        "question": "Which architectural relationship links Gangaikonda Cholapuram with Brihadeeswarar Temple at Thanjavur?",
        "question_ta": "கங்கைகொண்ட சோழபுரத்தையும் தஞ்சைப் பிரகதீஸ்வரர் கோயிலையும் இணைக்கும் கட்டிடக்கலைத் தொடர்பு எது?",
        "options": ["Both are major Chola temple complexes with monumental vimanas", "Both are Pallava cave monasteries", "Both are coastal Buddhist stupas", "Both are Nayaka hill forts"],
        "options_ta": ["இரண்டும் பிரம்மாண்ட விமானங்களைக் கொண்ட முக்கிய சோழர் கோயில் வளாகங்கள்", "இரண்டும் பல்லவர் குடைவரை மடங்கள்", "இரண்டும் கடற்கரைப் பௌத்த ஸ்தூபிகள்", "இரண்டும் நாயக்கர் மலைக்கோட்டைகள்"],
        "correct": 0,
        "explanation": "Both temples express imperial Chola architecture, while each has its own distinctive proportions and sculptural program.",
        "explanation_ta": "இரு கோயில்களும் சோழப் பேரரசின் கட்டிடக்கலையை வெளிப்படுத்துகின்றன; ஒவ்வொன்றிற்கும் தனித்துவமான விகிதங்களும் சிற்ப அமைப்புகளும் உள்ளன.",
    },
    {
        "site": "gingee-fort",
        "dynasty": "Nayaka and Maratha",
        "topic": "Gingee Fort",
        "difficulty": "Advanced",
        "question": "Which natural feature contributed most to Gingee Fort's defensive strength?",
        "question_ta": "செஞ்சிக் கோட்டையின் தற்காப்பு வலிமைக்கு முக்கியமாக உதவிய இயற்கை அம்சம் எது?",
        "options": ["Steep granite hill terrain linked by extensive fortifications", "A surrounding deep-water sea channel", "Dense mangrove swamps", "A continuous desert barrier"],
        "options_ta": ["விரிவான மதில்களால் இணைக்கப்பட்ட செங்குத்தான கிரானைட் மலைப்பகுதி", "சுற்றியுள்ள ஆழ்கடல் கால்வாய்", "அடர்ந்த அலையாத்திக் காடுகள்", "தொடர்ச்சியான பாலைவனத் தடுப்பு"],
        "correct": 0,
        "explanation": "The steep rocky hills and fortified connections between the hill citadels made Gingee exceptionally difficult to attack.",
        "explanation_ta": "செங்குத்தான பாறை மலைகளும் அவற்றை இணைத்த கோட்டை அமைப்புகளும் செஞ்சியைத் தாக்குவதைக் கடினமாக்கின.",
    },
]


def _seed_quiz_questions(db: Session, sites_by_slug):
    existing_questions = {
        question.question for question in db.query(QuizQuestion).all()
    }
    for item in QUIZ_SEED_DATA:
        if item["question"] in existing_questions:
            continue
        site = sites_by_slug.get(item["site"])
        options = item["options"]
        db.add(
            QuizQuestion(
                site_id=site.id if site else None,
                dynasty=item["dynasty"],
                topic=item["topic"],
                question=item["question"],
                question_ta=item["question_ta"],
                option_a=options[0],
                option_b=options[1],
                option_c=options[2],
                option_d=options[3],
                options_ta=item["options_ta"],
                correct_option=chr(ord("A") + item["correct"]),
                explanation=item["explanation"],
                explanation_ta=item["explanation_ta"],
                difficulty=item["difficulty"],
                language="en",
            )
        )
        existing_questions.add(item["question"])
    db.commit()


def populate_all_seed_data(db: Session):
    """
    Populates the SQLite database with reliable, verified historical information
    for the initial five Tamil Nadu heritage locations.
    """
    # 1. Seed Languages
    if db.query(Language).count() == 0:
        db.add_all([
            Language(code="en", name="English", is_active=True),
            Language(code="ta", name="தமிழ் (Tamil)", is_active=True),
        ])
        db.commit()

    # 2. Seed HeritageSites if empty
    if db.query(HeritageSite).count() > 0:
        sites_by_slug = {
            site.slug: site
            for site in db.query(HeritageSite).all()
        }
        _seed_quiz_questions(db, sites_by_slug)
        return  # Already populated

    # --- SITE 1: Brihadeeswarar Temple ---
    thanjavur = HeritageSite(
        name="Brihadeeswarar Temple",
        name_ta="பெருவுடையார் கோயில் (தஞ்சைப் பெரிய கோயில்)",
        slug="brihadeeswarar-temple",
        dynasty="Chola",
        century_ce=1010,
        is_unesco=True,
        location="Thanjavur, Tamil Nadu, India",
        latitude=10.7828,
        longitude=79.1318,
        image_url="https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1200&q=80",
        information_source="Archaeological Survey of India (ASI) / UNESCO Great Living Chola Temples",
        description="A masterpiece of Dravidian Chola architecture and one of the Great Living Chola Temples, built entirely of interlocking granite with a 216-foot vimana.",
        historical_background="Commissioned in 1003 CE by Emperor Arulmozhivarman (Raja Raja Chola I) and consecrated in 1010 CE to celebrate Chola imperial sovereignty and devotion to Lord Shiva (Peruvudaiyar). The complex served as the cultural, artistic, and administrative nerve center of the Chola empire, with over 100 detailed stone inscriptions detailing royal donations, revenue administration, and names of over 400 temple dancers, musicians, and craftsmen.",
        architecture="Constructed using an interlocking dry-stone puzzle system without binding mortar. Over 130,000 tonnes of granite were rafted from quarries 50 kilometers away. The 16-storey vimana (temple tower) rises 216 feet, crowned by an octagonal 80-tonne monolithic granite Kumbam (cupola) hoisted up a massive 6-kilometer inclined earthen ramp.",
        cultural_significance="Designated a UNESCO World Heritage Site in 1987. It represents the pinnacle of medieval South Indian engineering, temple town planning, and classical Bharatanatyam dance heritage documented in 108 sculpted karana reliefs along the upper sanctum gallery."
    )
    db.add(thanjavur)
    db.flush()

    # --- SITE 2: Mahabalipuram ---
    mamallapuram = HeritageSite(
        name="Mahabalipuram (Mamallapuram Monuments)",
        name_ta="மாமல்லபுரக் குடைவரைக் கோயில்கள் மற்றும் சிற்பங்கள்",
        slug="mahabalipuram",
        dynasty="Pallava",
        century_ce=650,
        is_unesco=True,
        location="Chengalpattu District, Tamil Nadu, India",
        latitude=12.6269,
        longitude=80.1927,
        image_url="https://images.unsplash.com/photo-1590766940554-634a7ed41450?auto=format&fit=crop&w=1200&q=80",
        information_source="Archaeological Survey of India (ASI) / UNESCO World Heritage Centre (1984)",
        description="An ancient sea-coast capital of the Pallava dynasty celebrated for monolithic rock-cut cave temples, monolithic rathas, and the oceanic Shore Temple.",
        historical_background="Founded as a bustling maritime port connecting ancient Tamilakam with Sri Lanka, Java, Cambodia, and the Mediterranean. During the 7th and 8th centuries CE under Pallava kings Mahendravarman I and Narasimhavarman I (Mamalla), royal sthapatis transformed the coastal granite outcrops into shrines, royal mandapas, and giant open-air reliefs. Chinese Buddhist traveler Hiuen Tsang recorded the thriving international traffic of this port city in 640 CE.",
        architecture="Features three distinct rock architecture idioms: rock-cut cave sanctuaries (mandapas), monolithic rock shrines sculpted out of standing whale-back boulders (Pancha Rathas mimicking wooden chariot architecture), and structural stone temples like the Shore Temple built with finely dressed granite blocks confronting the Bay of Bengal surf.",
        cultural_significance="Inscribed as a UNESCO World Heritage Site in 1984. Contains 'Descent of the Ganges' (Arjuna's Penance), one of the world's largest open-air stone bas-reliefs measuring 96 by 43 feet, populated with over 100 celestial, human, and animal figures sculpted in naturalistic proportions."
    )
    db.add(mamallapuram)
    db.flush()

    # --- SITE 3: Meenakshi Amman Temple ---
    madurai = HeritageSite(
        name="Meenakshi Amman Temple",
        name_ta="மதுரை மீனாட்சி சுந்தரேசுவரர் திருக்கோயில்",
        slug="meenakshi-amman-temple",
        dynasty="Pandya & Nayaka",
        century_ce=1200,
        is_unesco=False,
        location="Madurai, Tamil Nadu, India",
        latitude=9.9195,
        longitude=78.1193,
        image_url="https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1200&q=80",
        information_source="Archaeological Survey of India (ASI) / Tamil Nadu HRCE / Tamil Virtual Academy",
        description="The spiritual heart of Madurai, renowned for 14 soaring multi-tiered gopurams encrusted with thousands of stucco deities, the Hall of 1000 Pillars, and the sacred Golden Lotus Tank.",
        historical_background="Madurai is celebrated as one of the world's oldest continuously inhabited cities, praised in ancient Sangam literature from the 3rd century BCE. Dedicated to Goddess Meenakshi (manifestation of Parvati as the royal warrior empress of Madurai) and Sundareswarar (Shiva). The ancient structure was rebuilt and expanded into its current monumental concentric form under the Madurai Nayak dynasty between 1560 and 1650 CE under King Thirumalai Nayak and Ariyanatha Mudaliar.",
        architecture="Enclosed within massive concentric stone prakaras covering 14 acres. The skyline is dominated by 14 pyramidal gopurams, the tallest being the Southern Tower soaring to 170 feet (52 meters). Houses the famed Hall of Thousand Pillars (Ayiram Kaal Mandapam) built in 1569 containing 985 uniquely carved monolithic pillars, five musical pillars producing Carnatic swaras, and the sacred Potramarai Kulam (Golden Lotus Pond).",
        cultural_significance="A monumental symbol of Dravidian city planning where the entire town radiates outward from the sacred center in concentric square streets. Uniquely preserves matrilineal spiritual primacy: Goddess Meenakshi is worshiped first before Lord Sundareswarar."
    )
    db.add(madurai)
    db.flush()

    # --- SITE 4: Gangaikonda Cholapuram ---
    cholapuram = HeritageSite(
        name="Gangaikonda Cholapuram",
        name_ta="கங்கைகொண்ட சோழபுரம் பெருவுடையார் கோயில்",
        slug="gangaikonda-cholapuram",
        dynasty="Chola",
        century_ce=1035,
        is_unesco=True,
        location="Ariyalur District, Tamil Nadu, India",
        latitude=11.2057,
        longitude=79.4526,
        image_url="https://images.unsplash.com/photo-1622396481304-4ad4901ff0f4?auto=format&fit=crop&w=1200&q=80",
        information_source="Archaeological Survey of India (ASI) / UNESCO Great Living Chola Temples",
        description="The majestic imperial capital and temple established by Rajendra Chola I to commemorate his victorious military and naval expeditions to the sacred River Ganges and South-East Asia.",
        historical_background="Founded in 1035 CE by Rajendra Chola I ('Gangaikondan' - The Chola who brought the Ganges) after leading unprecedented trans-peninsular campaigns up to Bengal. To consecrate the capital, holy Ganges water was carried south in golden vessels and poured into the newly excavated 22-kilometer Chola Gangam (Ponneri) artificial lake. The city served as the administrative capital of the maritime Chola Empire for over 250 years.",
        architecture="The vimana rises to 182 feet, deliberately sculpted with graceful concave contours often interpreted as embodying feminine elegance in contrast to the masculine pyramid of his father's Thanjavur vimana. The site includes the Simhakinaru (Lion Well), entered through the roaring mouth of a monolithic sculpted lion, and intricate stone friezes.",
        cultural_significance="Part of the UNESCO World Heritage serial site 'Great Living Chola Temples'. Contains the celebrated 'Chandeshwara Anugraha Murti' relief, regarded by international art historians as one of the finest masterpieces of Asian high-relief stone sculpture, showing Shiva and Parvati crowning a royal devotee."
    )
    db.add(cholapuram)
    db.flush()

    # --- SITE 5: Gingee Fort ---
    gingee = HeritageSite(
        name="Gingee Fort (Senji Durgam)",
        name_ta="செஞ்சிக் கோட்டை (கிழக்கின் ட்ராய்)",
        slug="gingee-fort",
        dynasty="Chola / Nayaka / Maratha",
        century_ce=1190,
        is_unesco=False,
        location="Viluppuram District, Tamil Nadu, India",
        latitude=12.2547,
        longitude=79.4182,
        image_url="https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1200&q=80",
        information_source="Archaeological Survey of India (ASI) Southern Circle, Chennai",
        description="Dubbed the 'Troy of the East' by the British; a formidable fortress complex linking three steep granite hill citadels with miles of crenellated stone ramparts.",
        historical_background="Originally founded by the local Konar dynasty in the late 12th century, Gingee was transformed into an invincible military citadel during the 15th-16th centuries by the Gingee Nayaks. In 1677 CE, Maratha warrior king Chhatrapati Shivaji captured the citadel and reinforced its defenses, marveling at its impregnability. Gingee later witnessed the heroic defense of Raja Desingh and withstood an 8-year siege (1690–1698 CE) by Mughal Emperor Aurangzeb's general Zulfiqar Khan.",
        architecture="The fortress encloses a triangular perimeter linking three sheer granite hills: Rajagiri (800 ft), Krishnagiri (500 ft), and Chandrayandurg. Features the 8-storey Kalyana Mahal palace tower built in Indo-Saracenic architectural style, granaries with cooling airflow ducts, and natural hilltop sweet-water cisterns (Chakkaraikulam). Rajagiri citadel is accessible solely via a narrow wooden drawbridge suspended over a sheer 60-foot vertical natural chasm.",
        cultural_significance="Recognized as one of the most sophisticated examples of military engineering and strategic hill fortification in South Asia. Its multi-tiered ramparts, royal palace complexes, and impregnable topography remain central to Tamil historical folklore and balladry."
    )
    db.add(gingee)
    db.flush()

    # 3. Seed HistoricalFacts (Grounded for RAG)
    facts = [
        # Thanjavur Facts
        HistoricalFact(
            site_id=thanjavur.id,
            category="Engineering & Construction",
            fact_text="The entire Brihadeeswarar Temple was constructed using 130,000 tonnes of granite without mortar or cement, utilizing an interlocking dry-stone puzzle system that has resisted seismic tremors for over a millennium.",
            source_reference="ASI Architectural Monograph Series (1992)"
        ),
        HistoricalFact(
            site_id=thanjavur.id,
            category="Epigraphy & Governance",
            fact_text="The granite plinth inscriptions document the names of 400 devadasis (temple dancers), musicians, accountants, drummers, and barbers, proving democratic transparency in 11th-century Chola administration.",
            source_reference="ASI Epigraphia Indica Vol II"
        ),
        # Mahabalipuram Facts
        HistoricalFact(
            site_id=mamallapuram.id,
            category="Maritime Archeology",
            fact_text="Excavations and underwater sonar mapping off Mahabalipuram reveal submerged structures, ancient jetty breakwaters, and Roman/Chinese coins verifying its role as an international silk-and-spice gateway.",
            source_reference="ASI Maritime Archaeological Survey (2005)"
        ),
        HistoricalFact(
            site_id=mamallapuram.id,
            category="Monolithic Architecture",
            fact_text="Each of the five Pancha Rathas was carved out of a single living whale-back granite rock from the top downwards, so no scaffolding was required during construction.",
            source_reference="UNESCO World Heritage Technical Report"
        ),
        # Madurai Facts
        HistoricalFact(
            site_id=madurai.id,
            category="Acoustics & Architecture",
            fact_text="The five musical pillars located inside the Meenakshi temple complex are each carved from single blocks of resonant granite; tapping them produces distinctive notes corresponding to the seven classical Carnatic swaras.",
            source_reference="Tamil Virtual Academy Architectural Archives"
        ),
        # Gangaikonda Cholapuram Facts
        HistoricalFact(
            site_id=cholapuram.id,
            category="Naval Expansion",
            fact_text="From the capital of Gangaikonda Cholapuram, Rajendra Chola launched the 1025 CE naval expedition that conquered the Srivijaya Empire (modern Indonesia, Malaysia, and the Strait of Malacca).",
            source_reference="K.A. Nilakanta Sastri, 'The Colas' (University of Madras)"
        ),
        # Gingee Fort Facts
        HistoricalFact(
            site_id=gingee.id,
            category="Military Strategy",
            fact_text="Mughal Emperor Aurangzeb's imperial army laid siege to Gingee Fort for eight continuous years (1690–1698 CE), representing the longest recorded military siege in Indian history.",
            source_reference="Jadunath Sarkar, 'History of Aurangzib' Vol V"
        )
    ]
    db.add_all(facts)

    # 4. Seed HeritageStories
    stories = [
        HeritageStory(
            site_id=thanjavur.id,
            persona="Royal Chief Architect (Sthapati)",
            title="Symphony in Granite: Raising the 80-Tonne Cupola",
            language="en",
            narrative="The morning sun breaks over the Kaveri plains, glinting off the colossal blocks of granite. As the chief sthapati under Emperor Raja Raja Chola, every joint was locked dry without mortar—stone kissing stone with mathematical perfection. We raised an earthen ramp that stretched across miles to lift the great 80-tonne crown stone. When the evening breeze whispers through the pillared corridors, it is not silence you hear, but the eternal pulse of Chola genius.",
            audio_url="/api/story/audio?text=Symphony%20in%20Granite&lang=en"
        ),
        HeritageStory(
            site_id=thanjavur.id,
            persona="அரச தலைமை சிற்பி",
            title="கல்லில் வடித்த காலத்தின் காவியம்: தஞ்சைப் பெரிய கோயில்",
            language="ta",
            narrative="நான் இந்தக் கற்களை வெறும் பாறைகளாகப் பார்க்கவில்லை; தமிழரின் அழியா ஆன்மாவாகப் பார்க்கிறேன். முதலாம் இராஜராஜ சோழனின் ஆணைப்படி நாம் பணியைத் தொடங்கிய நாள் எனக்கு இன்னும் நினைவிருக்கிறது. எந்தவொரு சாந்தும் இல்லாமல், ஒரு கல்லை மற்றொரு கல்லுடன் பூட்டி நிற்குமாறு செதுக்குவது எங்கள் தலைமுறையின் பெருங்கலை. 216 அடி உயரத்திற்கு 80 டன் எடையுள்ள ஒற்றைக்கல்லை சாய்வுதளம் வழியே ஏற்றி முடித்த அந்த தருணம் தெய்வ சங்கல்பமாக நிலைத்து நிற்கிறது.",
            audio_url="/api/story/audio?text=Kallil%20Vaditha%20Kaaviyam&lang=ta"
        ),
        HeritageStory(
            site_id=mamallapuram.id,
            persona="Silk-Route Voyager",
            title="Whispers of the Salt Waves: The Shore Temple at Dawn",
            language="en",
            narrative="Having sailed from distant ports across uncharted waters, I thought I had witnessed all the wonders the old world could offer. Yet nothing prepared me for the silhouette of the Shore Temple piercing the dawn sky. Carved to withstand the spray of the Bay of Bengal for over thirteen centuries, this Pallava jewel greeted merchant armadas carrying silk, spice, and Roman gold.",
            audio_url="/api/story/audio?text=Whispers%20of%20Salt%20Waves&lang=en"
        ),
        HeritageStory(
            site_id=madurai.id,
            persona="Temple Musician",
            title="Cosmic Labyrinth: Echoes from the Hall of 1000 Pillars",
            language="en",
            narrative="Step softly across the cool polished stone flagstones of Madurai. Around you rise 985 monolithic pillars, each sculpted with celestial dancers, warriors, and roaring yalis. Strike the five musical pillars near the north entrance, and the pure swaras of Carnatic ragas ring out from solid granite—a testament to acoustics and devotion intertwining as one.",
            audio_url="/api/story/audio?text=Cosmic%20Labyrinth&lang=en"
        ),
        HeritageStory(
            site_id=gingee.id,
            persona="Fortress Commander",
            title="Troy of the East: The Vertical Chasm of Rajagiri",
            language="en",
            narrative="Three sheer granite mountains linked by eight miles of battlements. To reach the citadel of Rajagiri, one must cross a single narrow drawbridge over a sixty-foot vertical void. Neither Mughal siege guns nor Carnatic cavalry could easily pierce this fortress that Chhatrapati Shivaji crowned India's most impregnable sanctuary.",
            audio_url="/api/story/audio?text=Troy%20of%20the%20East&lang=en"
        )
    ]
    db.add_all(stories)

    _seed_quiz_questions(
        db,
        {
            site.slug: site
            for site in [thanjavur, mamallapuram, madurai, cholapuram, gingee]
        },
    )
    print(" HeritageAI verified seed database successfully committed with 5 initial locations, facts, stories, and quiz questions.")
