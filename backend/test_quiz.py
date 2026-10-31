import os
import sys
import unittest

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

import app.models
from app.database.session import Base
from app.models.quiz_question import QuizQuestion
from app.routes.quiz import (
    check_quiz_answer,
    get_quiz_questions,
    get_quiz_result,
    submit_quiz_answers,
)
from app.schemas.quiz import AnswerCheckRequest, QuizSubmitRequest


class CulturalQuizTests(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine(
            "sqlite://",
            connect_args={"check_same_thread": False},
            poolclass=StaticPool,
        )
        Base.metadata.create_all(bind=self.engine)
        self.session = sessionmaker(bind=self.engine)()
        self.session.add_all([
            QuizQuestion(
                dynasty="Chola",
                topic="Chola Dynasty",
                question=f"Question for {difficulty}",
                question_ta=f"{difficulty} வினா",
                option_a="Option A",
                option_b="Option B",
                option_c="Option C",
                option_d="Option D",
                options_ta=["விடை அ", "விடை ஆ", "விடை இ", "விடை ஈ"],
                correct_option="B",
                explanation="Historical explanation",
                explanation_ta="வரலாற்று விளக்கம்",
                difficulty=difficulty,
            )
            for difficulty in ("Beginner", "Intermediate", "Advanced")
        ])
        self.session.commit()

    def tearDown(self):
        self.session.close()
        self.engine.dispose()

    def test_questions_filter_and_four_options(self):
        questions = get_quiz_questions(
            limit=30,
            dynasty=None,
            site_id=None,
            difficulty="Beginner",
            db=self.session,
        )
        self.assertEqual(len(questions), 1)
        self.assertEqual(questions[0].difficulty, "Beginner")
        self.assertEqual(len(questions[0].options_en), 4)
        self.assertEqual(len(questions[0].options_ta), 4)

    def test_answer_feedback_and_persisted_result(self):
        question = self.session.query(QuizQuestion).filter_by(difficulty="Beginner").one()
        feedback = check_quiz_answer(
            AnswerCheckRequest(question_id=question.id, selected_option_index=1),
            db=self.session,
        )
        self.assertTrue(feedback.correct)

        payload = QuizSubmitRequest(
            difficulty="Beginner",
            answers=[{"question_id": question.id, "selected_option_index": 1}],
        )
        result = submit_quiz_answers(payload, db=self.session)
        self.assertEqual((result.score, result.total, result.percentage), (1, 1, 100))
        stored_result = get_quiz_result(result.submission_id, db=self.session)
        self.assertEqual(stored_result.rank_title_en, result.rank_title_en)
        self.assertTrue(stored_result.feedback[0].correct)


if __name__ == "__main__":
    unittest.main()
