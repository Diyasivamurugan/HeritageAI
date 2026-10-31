from typing import List, Tuple
from sqlalchemy.orm import Session
from app.models.heritage_site import HeritageSite
from app.models.historical_fact import HistoricalFact
from app.schemas.chat import SourceCitation

def retrieve_monument_context(db: Session, monument_id: int, language: str = "en") -> Tuple[str, List[SourceCitation]]:
    """
    Retrieves full verified context for a specific heritage site to ground AI story generation.
    """
    site = db.query(HeritageSite).filter(HeritageSite.id == monument_id).first()
    if not site:
        return "", []

    facts = db.query(HistoricalFact).filter(HistoricalFact.site_id == monument_id).all()

    context_lines = []
    citations = []

    if language == "ta":
        context_lines.append(f"பெயர்: {site.name_ta or site.name}")
        context_lines.append(f"அமைவிடம்: {site.location}")
        context_lines.append(f"வரலாற்றுப் பின்னணி: {site.historical_background}")
        context_lines.append(f"கட்டிடக்கலை: {site.architecture}")
        context_lines.append(f"கலாச்சார முக்கியத்துவம்: {site.cultural_significance}")
        for f in facts:
            context_lines.append(f"உண்மைத் தகவல் ({f.category}): {f.fact_text}")
            citations.append(SourceCitation(
                monument_name=site.name_ta or site.name,
                category=f.category,
                fact_snippet=f.fact_text[:120],
                source=f.source_reference
            ))
    else:
        context_lines.append(f"Name: {site.name}")
        context_lines.append(f"Location: {site.location}")
        context_lines.append(f"Historical Background: {site.historical_background}")
        context_lines.append(f"Architecture: {site.architecture}")
        context_lines.append(f"Cultural Significance: {site.cultural_significance}")
        for f in facts:
            context_lines.append(f"Historical Fact ({f.category}): {f.fact_text}")
            citations.append(SourceCitation(
                monument_name=site.name,
                category=f.category,
                fact_snippet=f.fact_text[:120],
                source=f.source_reference
            ))

    return "\n".join(context_lines), citations


def search_and_retrieve_rag_context(db: Session, query: str, selected_monument_id: int = None, language: str = "en") -> Tuple[str, List[SourceCitation]]:
    """
    RAG search across the verified heritage site database.
    """
    citations: List[SourceCitation] = []
    context_lines: List[str] = []

    if selected_monument_id:
        return retrieve_monument_context(db, selected_monument_id, language)

    # Search across sites and facts
    query_lower = query.lower()
    sites = db.query(HeritageSite).all()
    matched_sites = []

    for s in sites:
        if (s.slug in query_lower or
            s.name.lower() in query_lower or
            (s.name_ta and s.name_ta in query) or
            s.dynasty.lower() in query_lower or
            s.location.lower() in query_lower):
            matched_sites.append(s)

    if not matched_sites:
        matched_sites = sites[:3]

    for s in matched_sites:
        name = s.name_ta if (language == "ta" and s.name_ta) else s.name
        context_lines.append(f"[{name}] {s.description} ({s.location}, {s.dynasty})")

        facts = db.query(HistoricalFact).filter(HistoricalFact.site_id == s.id).limit(2).all()
        for f in facts:
            context_lines.append(f"- {f.fact_text}")
            citations.append(SourceCitation(
                monument_name=name,
                category=f.category,
                fact_snippet=f.fact_text[:120],
                source=f.source_reference
            ))

    return "\n\n".join(context_lines), citations
