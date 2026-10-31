from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.quiz_question import QuizQuestion, QuizSubmission
from app.schemas.quiz import (
    AnswerCheckRequest,
    AnswerFeedback,
    QuizQuestionResponse,
    QuizResultResponse,
    QuizSubmitRequest,
    QuestionFeedback,
)

router = APIRouter(prefix="/api/quiz", tags=["Cultural Heritage Quiz"])

DIFFICULTY_NAMES = {
    "Easy": "Beginner",
    "Beginner": "Beginner",
    "Medium": "Intermediate",
    "Intermediate": "Intermediate",
    "Hard": "Advanced",
    "Advanced": "Advanced",
}


def _correct_index(question: QuizQuestion) -> int:
    return ord(question.correct_option.upper()) - ord("A")


def _question_response(question: QuizQuestion) -> QuizQuestionResponse:
    options_en = [
        question.option_a,
        question.option_b,
        question.option_c,
        question.option_d,
    ]
    return QuizQuestionResponse(
        id=question.id,
        site_id=question.site_id,
        dynasty=question.dynasty,
        topic=question.topic or "Tamil Culture",
        question_en=question.question,
        question_ta=question.question_ta or question.question,
        options_en=options_en,
        options_ta=question.options_ta or options_en,
        difficulty=DIFFICULTY_NAMES.get(question.difficulty, question.difficulty),
    )


def _answer_feedback(question: QuizQuestion, selected_index: int) -> AnswerFeedback:
    correct_index = _correct_index(question)
    return AnswerFeedback(
        question_id=question.id,
        correct=selected_index == correct_index,
        correct_index=correct_index,
        selected_index=selected_index,
        explanation_en=question.explanation,
        explanation_ta=question.explanation_ta or question.explanation,
    )


def _rank_titles(percentage: int) -> tuple[str, str]:
    if percentage == 100:
        return "Grand Heritage Scholar", "தலைசிறந்த மரபு அறிஞர்"
    if percentage >= 75:
        return "Senior Heritage Explorer", "மூத்த மரபு ஆய்வாளர்"
    if percentage >= 50:
        return "Heritage Enthusiast", "மரபு ஆர்வலர்"
    return "Heritage Novice", "மரபுப் புதியவர்"


@router.get("/questions", response_model=list[QuizQuestionResponse])
def get_quiz_questions(
    limit: int = Query(10, ge=1, le=30),
    dynasty: Optional[str] = Query(None, description="Optional dynasty filter"),
    site_id: Optional[int] = Query(None, ge=1),
    difficulty: Optional[str] = Query(
        None, pattern="^(Beginner|Intermediate|Advanced)$"
    ),
    db: Session = Depends(get_db),
):
    query = db.query(QuizQuestion)
    if site_id is not None:
        query = query.filter(QuizQuestion.site_id == site_id)
    if dynasty and dynasty.lower() != "all":
        query = query.filter(QuizQuestion.dynasty.ilike(f"%{dynasty}%"))
    if difficulty:
        stored_difficulty = {
            "Beginner": ("Beginner", "Easy"),
            "Intermediate": ("Intermediate", "Medium"),
            "Advanced": ("Advanced", "Hard"),
        }[difficulty]
        query = query.filter(QuizQuestion.difficulty.in_(stored_difficulty))
    return [_question_response(item) for item in query.order_by(QuizQuestion.id).limit(limit).all()]


@router.get("/site/{site_id}", response_model=list[QuizQuestionResponse])
def get_site_quiz_questions(site_id: int, db: Session = Depends(get_db)):
    questions = (
        db.query(QuizQuestion)
        .filter(QuizQuestion.site_id == site_id)
        .order_by(QuizQuestion.id)
        .all()
    )
    return [_question_response(item) for item in questions]


@router.post("/answer", response_model=AnswerFeedback)
def check_quiz_answer(payload: AnswerCheckRequest, db: Session = Depends(get_db)):
    question = db.query(QuizQuestion).filter(QuizQuestion.id == payload.question_id).first()
    if not question:
        raise HTTPException(status_code=404, detail="Quiz question not found")
    return _answer_feedback(question, payload.selected_option_index)


@router.post("/submit", response_model=QuizResultResponse)
def submit_quiz_answers(payload: QuizSubmitRequest, db: Session = Depends(get_db)):
    question_ids = [answer.question_id for answer in payload.answers]
    if len(set(question_ids)) != len(question_ids):
        raise HTTPException(status_code=422, detail="Each question may be answered only once")

    questions = (
        db.query(QuizQuestion)
        .filter(QuizQuestion.id.in_(question_ids))
        .all()
    )
    questions_by_id = {question.id: question for question in questions}
    if len(questions_by_id) != len(question_ids):
        raise HTTPException(status_code=422, detail="One or more quiz questions were not found")

    if payload.difficulty:
        legacy_difficulty = {
            "Beginner": "Easy",
            "Intermediate": "Medium",
            "Advanced": "Hard",
        }[payload.difficulty]
        if any(
            question.difficulty not in (payload.difficulty, legacy_difficulty)
            for question in questions
        ):
            raise HTTPException(status_code=422, detail="Answers do not match the selected difficulty")

    feedback = [
        _answer_feedback(questions_by_id[answer.question_id], answer.selected_option_index)
        for answer in payload.answers
    ]
    score = sum(item.correct for item in feedback)
    total = len(feedback)
    percentage = round(score * 100 / total)
    rank_en, rank_ta = _rank_titles(percentage)
    stored_feedback = [item.model_dump() for item in feedback]

    submission = QuizSubmission(
        participant_name=payload.participant_name,
        difficulty=payload.difficulty or "Mixed",
        score=score,
        total=total,
        percentage=percentage,
        rank_title_en=rank_en,
        rank_title_ta=rank_ta,
        feedback=stored_feedback,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)

    return QuizResultResponse(
        submission_id=submission.id,
        score=score,
        total=total,
        percentage=percentage,
        rank_title_en=rank_en,
        rank_title_ta=rank_ta,
        feedback=[QuestionFeedback(**item) for item in stored_feedback],
        difficulty=payload.difficulty,
        created_at=submission.created_at,
    )


@router.get("/results/{submission_id}", response_model=QuizResultResponse)
def get_quiz_result(submission_id: int, db: Session = Depends(get_db)):
    submission = (
        db.query(QuizSubmission)
        .filter(QuizSubmission.id == submission_id)
        .first()
    )
    if not submission:
        raise HTTPException(status_code=404, detail="Quiz result not found")
    return QuizResultResponse(
        submission_id=submission.id,
        score=submission.score,
        total=submission.total,
        percentage=submission.percentage,
        rank_title_en=submission.rank_title_en,
        rank_title_ta=submission.rank_title_ta,
        feedback=[QuestionFeedback(**item) for item in submission.feedback],
        difficulty=submission.difficulty,
        created_at=submission.created_at,
    )
