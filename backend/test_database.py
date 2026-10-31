"""
HeritageAI Database Test Suite
Tests schema creation, seed population, and full CRUD operations on SQLite.
"""

import sys
import os

# Put backend root into Python path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.database.session import init_db, SessionLocal, engine, Base
from app.database import crud
from app.models.heritage_site import HeritageSite
from app.models.heritage_story import HeritageStory
from app.models.historical_fact import HistoricalFact
from app.models.quiz_question import QuizQuestion
from app.models.language import Language

def run_tests():
    print("=" * 65)
    print("🏛️  HERITAGEAI SQLITE & SQLALCHEMY TEST SUITE")
    print("=" * 65)

    # 1. Test Database Initialization & Automatic Seeding
    print("\n[TEST 1] Testing Database Initialization & Automatic Seeding...")
    init_db()
    
    with SessionLocal() as db:
        # Check initial 5 locations
        sites = crud.get_all_heritage_sites(db)
        print(f" -> Found {len(sites)} heritage sites in database.")
        assert len(sites) >= 5, f"Expected at least 5 sites, got {len(sites)}"

        expected_names = [
            "Brihadeeswarar Temple",
            "Mahabalipuram",
            "Meenakshi Amman Temple",
            "Gangaikonda Cholapuram",
            "Gingee Fort"
        ]
        
        for name_prefix in expected_names:
            matched = [s for s in sites if name_prefix.lower() in s.name.lower()]
            assert len(matched) > 0, f"Missing required site: {name_prefix}"
            s = matched[0]
            # Verify required schema fields
            assert s.id is not None
            assert s.name
            assert s.description
            assert s.historical_background
            assert s.architecture
            assert s.cultural_significance
            assert s.location
            assert s.latitude != 0.0
            assert s.longitude != 0.0
            assert s.image_url.startswith("http")
            assert s.information_source
            print(f"    ✓ Verified '{s.name}' ({s.location})")

        print(" ✓ [PASS] All 5 initial Tamil Nadu heritage locations verified.")

        # Check Languages
        langs = crud.get_all_languages(db)
        assert len(langs) >= 2, "Expected English & Tamil languages"
        print(f" ✓ [PASS] Supported Languages verified: {[l.code for l in langs]}")

        # Check Stories & Facts
        thanjavur = crud.get_heritage_site_by_slug(db, "brihadeeswarar-temple")
        assert thanjavur is not None
        stories = crud.get_stories_by_site(db, thanjavur.id)
        facts = crud.get_facts_by_site(db, thanjavur.id)
        assert len(stories) > 0, "Expected stories for Thanjavur"
        assert len(facts) > 0, "Expected facts for Thanjavur"
        print(f" ✓ [PASS] Thanjavur has {len(stories)} stories and {len(facts)} verified facts.")

        # Check Quiz Questions
        quizzes = crud.get_quiz_questions(db, limit=5)
        assert len(quizzes) == 5, f"Expected 5 quiz questions, got {len(quizzes)}"
        for q in quizzes:
            assert q.question
            assert q.option_a and q.option_b and q.option_c and q.option_d
            assert q.correct_option in ["A", "B", "C", "D"]
            assert q.explanation
        print(" ✓ [PASS] Quiz questions retrieval verified.")

    # 2. Test CRUD: Search Locations
    print("\n[TEST 2] Testing Location Search...")
    with SessionLocal() as db:
        search_chola = crud.search_heritage_sites(db, "Chola")
        print(f" -> Search 'Chola': Found {len(search_chola)} sites.")
        assert len(search_chola) >= 2, "Expected at least 2 Chola sites (Thanjavur & Gangaikonda)"

        search_gingee = crud.search_heritage_sites(db, "Troy of the East")
        print(f" -> Search 'Troy of the East': Found {len(search_gingee)} sites.")
        assert len(search_gingee) == 1 and "Gingee" in search_gingee[0].name
        print(" ✓ [PASS] Search operations working correctly.")

    # 3. Test CRUD: Create, Update, Delete (Full Lifecycle)
    print("\n[TEST 3] Testing Dynamic CRUD Operations...")
    with SessionLocal() as db:
        # Create
        test_site_data = {
            "name": "Kailasanathar Temple, Kanchipuram",
            "name_ta": "காஞ்சிபுரம் கைலாசநாதர் கோயில்",
            "slug": "kanchipuram-kailasanathar-temple",
            "dynasty": "Pallava",
            "century_ce": 700,
            "is_unesco": False,
            "location": "Kanchipuram, Tamil Nadu, India",
            "latitude": 12.8422,
            "longitude": 79.6897,
            "image_url": "https://images.unsplash.com/photo-test-kanchi",
            "information_source": "Archaeological Survey of India (ASI) Chennai Circle",
            "description": "The oldest sandstone structural temple built by Rajasimha Pallava in Kanchipuram.",
            "historical_background": "Constructed between 685 and 705 CE by Narasimhavarman II (Rajasimha).",
            "architecture": "Steatite and sandstone Dravidian sanctuary with circumambulatory channel.",
            "cultural_significance": "Pinnacle of early classical Pallava stone sculpting."
        }
        created_site = crud.create_heritage_site(db, test_site_data)
        site_id = created_site.id
        print(f" -> Created new site with ID: {site_id}")
        assert site_id is not None

        # Read
        fetched = crud.get_heritage_site_by_id(db, site_id)
        assert fetched.name == "Kailasanathar Temple, Kanchipuram"
        print(f" -> Read created site: '{fetched.name}'")

        # Update
        updated = crud.update_heritage_site(db, site_id, {
            "description": "Updated sandstone masterpiece of Pallava era."
        })
        assert updated.description == "Updated sandstone masterpiece of Pallava era."
        print(f" -> Updated description: '{updated.description}'")

        # Delete
        deleted = crud.delete_heritage_site(db, site_id)
        assert deleted is True
        assert crud.get_heritage_site_by_id(db, site_id) is None
        print(f" -> Successfully deleted test site ID {site_id}.")
        print(" ✓ [PASS] Full CRUD lifecycle verified.")

    print("\n" + "=" * 65)
    print("🎉 ALL DATABASE & CRUD TESTS PASSED SUCCESSFULLY (100% OPERATIONAL)")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
