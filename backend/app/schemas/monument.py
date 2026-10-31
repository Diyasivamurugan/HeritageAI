from typing import List, Optional
from pydantic import BaseModel

class ArchitecturalHighlightSchema(BaseModel):
    id: int
    title_en: str
    title_ta: str
    description_en: str
    description_ta: str
    image_url: Optional[str] = None

    class Config:
        from_attributes = True


class HistoricalFactSchema(BaseModel):
    id: int
    category: str
    fact_en: str
    fact_ta: str
    citation: str

    class Config:
        from_attributes = True


class MonumentListItemSchema(BaseModel):
    id: int
    slug: str
    name_en: str
    name_ta: str
    dynasty: str
    built_by_en: str
    built_by_ta: str
    century_ce: int
    period: str
    district: str
    state: str
    latitude: float
    longitude: float
    is_unesco: bool
    architectural_style_en: str
    architectural_style_ta: str
    hero_image: str
    short_desc_en: str
    short_desc_ta: str

    class Config:
        from_attributes = True


class MonumentDetailSchema(MonumentListItemSchema):
    full_history_en: str
    full_history_ta: str
    significance_en: str
    significance_ta: str
    highlights: List[ArchitecturalHighlightSchema] = []
    facts: List[HistoricalFactSchema] = []

    class Config:
        from_attributes = True
