import os
import logging
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger(__name__)

# SQLite Database File Path
DB_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "heritage.db"))
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")

# SQLite Engine with multi-threading compatibility
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Declarative Base
Base = declarative_base()

def get_db():
    """FastAPI request dependency providing an isolated database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """
    Automatically creates all tables in SQLite and populates verified seed data.
    Ensures safe, idempotent startup execution.
    """
    import app.models  # Register all models with Base.metadata
    Base.metadata.create_all(bind=engine)
    if engine.dialect.name == "sqlite":
        columns = {column["name"] for column in inspect(engine).get_columns("quiz_questions")}
        migrations = {
            "topic": "ALTER TABLE quiz_questions ADD COLUMN topic VARCHAR(100) NOT NULL DEFAULT 'Tamil Culture'",
            "question_ta": "ALTER TABLE quiz_questions ADD COLUMN question_ta TEXT",
            "options_ta": "ALTER TABLE quiz_questions ADD COLUMN options_ta JSON",
            "explanation_ta": "ALTER TABLE quiz_questions ADD COLUMN explanation_ta TEXT",
        }
        with engine.begin() as connection:
            for column, statement in migrations.items():
                if column not in columns:
                    connection.execute(text(statement))

    from app.database.seed_data import populate_all_seed_data
    with SessionLocal() as db:
        populate_all_seed_data(db)
    
    logger.info("HeritageAI SQLite database successfully initialized.")
