from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.heritage_site import HeritageSite
from app.models.heritage_story import HeritageStory
from app.models.historical_fact import HistoricalFact
from app.models.quiz_question import QuizQuestion
from app.models.language import Language

# ==========================================
# 1. HERITAGE SITES CRUD OPERATIONS
# ==========================================

def create_heritage_site(db: Session, site_data: Dict[str, Any]) -> HeritageSite:
    """Create and persist a new HeritageSite."""
    site = HeritageSite(**site_data)
    db.add(site)
    db.commit()
    db.refresh(site)
    return site

def get_heritage_site_by_id(db: Session, site_id: int) -> Optional[HeritageSite]:
    """Retrieve an individual heritage site by primary key."""
    return db.query(HeritageSite).filter(HeritageSite.id == site_id).first()

def get_heritage_site_by_slug(db: Session, slug: str) -> Optional[HeritageSite]:
    """Retrieve an individual heritage site by unique slug."""
    return db.query(HeritageSite).filter(HeritageSite.slug == slug).first()

def get_all_heritage_sites(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    dynasty: Optional[str] = None,
    is_unesco: Optional[bool] = None
) -> List[HeritageSite]:
    """List heritage locations with pagination and optional filtering."""
    query = db.query(HeritageSite)
    if dynasty and dynasty.lower() != "all":
        query = query.filter(HeritageSite.dynasty.ilike(f"%{dynasty}%"))
    if is_unesco is not None:
        query = query.filter(HeritageSite.is_unesco == is_unesco)
    return query.offset(skip).limit(limit).all()

def search_heritage_sites(db: Session, search_term: str) -> List[HeritageSite]:
    """
    Search heritage locations matching across name, description, location, 
    architecture, cultural significance, or dynasty.
    """
    if not search_term or not search_term.strip():
        return db.query(HeritageSite).all()

    pattern = f"%{search_term.strip()}%"
    return db.query(HeritageSite).filter(
        or_(
            HeritageSite.name.ilike(pattern),
            HeritageSite.name_ta.ilike(pattern),
            HeritageSite.location.ilike(pattern),
            HeritageSite.dynasty.ilike(pattern),
            HeritageSite.description.ilike(pattern),
            HeritageSite.architecture.ilike(pattern),
            HeritageSite.cultural_significance.ilike(pattern)
        )
    ).all()

def update_heritage_site(db: Session, site_id: int, update_data: Dict[str, Any]) -> Optional[HeritageSite]:
    """Update an existing heritage site."""
    site = get_heritage_site_by_id(db, site_id)
    if not site:
        return None
    for key, val in update_data.items():
        if hasattr(site, key):
            setattr(site, key, val)
    db.commit()
    db.refresh(site)
    return site

def delete_heritage_site(db: Session, site_id: int) -> bool:
    """Delete a heritage site and its cascading records."""
    site = get_heritage_site_by_id(db, site_id)
    if not site:
        return False
    db.delete(site)
    db.commit()
    return True


# ==========================================
# 2. HERITAGE STORIES CRUD OPERATIONS
# ==========================================

def create_heritage_story(db: Session, story_data: Dict[str, Any]) -> HeritageStory:
    """Create and persist a historical narrative."""
    story = HeritageStory(**story_data)
    db.add(story)
    db.commit()
    db.refresh(story)
    return story

def get_stories_by_site(db: Session, site_id: int, language: Optional[str] = None) -> List[HeritageStory]:
    """Retrieve historical stories associated with a specific site."""
    query = db.query(HeritageStory).filter(HeritageStory.site_id == site_id)
    if language:
        query = query.filter(HeritageStory.language == language)
    return query.all()

def get_all_stories(db: Session, skip: int = 0, limit: int = 100) -> List[HeritageStory]:
    """Retrieve all archived historical stories."""
    return db.query(HeritageStory).offset(skip).limit(limit).all()


# ==========================================
# 3. HISTORICAL FACTS CRUD OPERATIONS
# ==========================================

def create_historical_fact(db: Session, fact_data: Dict[str, Any]) -> HistoricalFact:
    """Create a verified historical fact for RAG grounding."""
    fact = HistoricalFact(**fact_data)
    db.add(fact)
    db.commit()
    db.refresh(fact)
    return fact

def get_facts_by_site(db: Session, site_id: int) -> List[HistoricalFact]:
    """Retrieve verified historical facts for a specific site."""
    return db.query(HistoricalFact).filter(HistoricalFact.site_id == site_id).all()


# ==========================================
# 4. QUIZ QUESTIONS CRUD OPERATIONS
# ==========================================

def create_quiz_question(db: Session, question_data: Dict[str, Any]) -> QuizQuestion:
    """Create a new quiz question."""
    question = QuizQuestion(**question_data)
    db.add(question)
    db.commit()
    db.refresh(question)
    return question

def get_quiz_questions(
    db: Session,
    limit: int = 5,
    dynasty: Optional[str] = None,
    difficulty: Optional[str] = None
) -> List[QuizQuestion]:
    """Retrieve quiz questions with optional dynasty and difficulty filters."""
    import random
    query = db.query(QuizQuestion)
    if dynasty and dynasty.lower() != "all":
        query = query.filter(QuizQuestion.dynasty.ilike(f"%{dynasty}%"))
    if difficulty:
        legacy_difficulty = {
            "Beginner": "Easy",
            "Intermediate": "Medium",
            "Advanced": "Hard",
        }.get(difficulty)
        if legacy_difficulty:
            query = query.filter(
                or_(
                    QuizQuestion.difficulty == difficulty,
                    QuizQuestion.difficulty == legacy_difficulty,
                )
            )
        else:
            query = query.filter(QuizQuestion.difficulty == difficulty)
    all_q = query.all()
    if not all_q:
        return []
    return random.sample(all_q, min(len(all_q), limit))

def get_quiz_questions_by_site(db: Session, site_id: int) -> List[QuizQuestion]:
    """Retrieve quiz questions associated with a specific site."""
    return db.query(QuizQuestion).filter(QuizQuestion.site_id == site_id).all()


# ==========================================
# 5. LANGUAGES CRUD OPERATIONS
# ==========================================

def create_language(db: Session, lang_data: Dict[str, Any]) -> Language:
    """Register a supported language."""
    lang = Language(**lang_data)
    db.add(lang)
    db.commit()
    db.refresh(lang)
    return lang

def get_all_languages(db: Session) -> List[Language]:
    """Retrieve all supported active languages."""
    return db.query(Language).filter(Language.is_active == True).all()
