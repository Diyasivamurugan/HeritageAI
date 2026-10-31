from sqlalchemy import Column, Integer, String, Boolean
from app.database.session import Base

class Language(Base):
    __tablename__ = "languages"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    code = Column(String(10), unique=True, index=True, nullable=False)  # 'en', 'ta'
    name = Column(String(100), nullable=False)                         # 'English', 'தமிழ் (Tamil)'
    is_active = Column(Boolean, default=True)
