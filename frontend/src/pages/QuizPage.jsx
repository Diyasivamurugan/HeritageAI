import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowRight,
  Award,
  CheckCircle2,
  RotateCcw,
  Trophy,
  XCircle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import {
  checkQuizAnswer,
  fetchQuizQuestions,
  submitQuizApi,
} from '../services/quizService';

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

export default function QuizPage() {
  const { language } = useLanguage();
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState('Beginner');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [answerFeedback, setAnswerFeedback] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [checkingQuestionId, setCheckingQuestionId] = useState(null);
  const [error, setError] = useState('');
  const isTamil = language === 'ta';

  const copy = {
    difficulty: isTamil ? 'சிரம நிலை' : 'Difficulty',
    beginner: isTamil ? 'தொடக்கநிலை' : 'Beginner',
    intermediate: isTamil ? 'இடைநிலை' : 'Intermediate',
    advanced: isTamil ? 'மேம்பட்ட நிலை' : 'Advanced',
    loading: isTamil ? 'வினாக்கள் ஏற்றப்படுகின்றன...' : 'Loading quiz questions...',
    question: isTamil ? 'கேள்வி' : 'Question',
    next: isTamil ? 'அடுத்த கேள்வி' : 'Next Question',
    previous: isTamil ? 'முந்தையது' : 'Previous',
    submit: isTamil ? 'விடைகளைச் சமர்ப்பிக்கவும்' : 'Submit & View Score',
    restart: isTamil ? 'மீண்டும் தொடங்க' : 'Restart Quiz',
    correct: isTamil ? 'சரியான விடை!' : 'Correct!',
    incorrect: isTamil ? 'மீண்டும் முயற்சி செய்யலாம்.' : 'Not quite—here is the correct answer.',
    progress: isTamil ? 'முன்னேற்றம்' : 'Progress',
    tryAgain: isTamil ? 'மீண்டும் முயற்சிக்கவும்' : 'Try again',
    noQuestions: isTamil ? 'இந்த நிலையில் வினாக்கள் இல்லை.' : 'No questions are available for this level.',
  };
  const difficultyLabels = {
    Beginner: copy.beginner,
    Intermediate: copy.intermediate,
    Advanced: copy.advanced,
  };

  async function loadQuestions(level = difficulty) {
    setIsLoading(true);
    setError('');
    setQuizResult(null);
    setUserAnswers({});
    setAnswerFeedback({});
    setCurrentIdx(0);
    try {
      const data = await fetchQuizQuestions(level);
      setQuestions(data);
      if (!data.length) setError(copy.noQuestions);
    } catch (loadError) {
      console.error('Failed loading quiz questions:', loadError);
      setQuestions([]);
      setError(isTamil ? 'வினாக்களை ஏற்ற முடியவில்லை.' : 'Unable to load quiz questions.');
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadQuestions('Beginner');
  }, []);

  async function handleSelectOption(questionId, optionIndex) {
    if (answerFeedback[questionId] || checkingQuestionId !== null) return;
    setUserAnswers(previous => ({ ...previous, [questionId]: optionIndex }));
    setCheckingQuestionId(questionId);
    setError('');
    try {
      const feedback = await checkQuizAnswer({
        question_id: questionId,
        selected_option_index: optionIndex,
      }, activeQuestion);
      setAnswerFeedback(previous => ({ ...previous, [questionId]: feedback }));
    } catch (answerError) {
      console.error('Failed checking quiz answer:', answerError);
      setUserAnswers(previous => {
        const remainingAnswers = { ...previous };
        delete remainingAnswers[questionId];
        return remainingAnswers;
      });
      setError(isTamil ? 'விடையைச் சரிபார்க்க முடியவில்லை. மீண்டும் தேர்வு செய்யவும்.' : 'Could not check that answer. Please select it again.');
    } finally {
      setCheckingQuestionId(null);
    }
  }

  function handleNext() {
    if (currentIdx < questions.length - 1) setCurrentIdx(index => index + 1);
  }

  function handlePrevious() {
    if (currentIdx > 0) setCurrentIdx(index => index - 1);
  }

  async function handleSubmitQuiz() {
    if (isSubmitting || Object.keys(answerFeedback).length !== questions.length) return;
    setIsSubmitting(true);
    setError('');
    const answers = questions.map(question => ({
      question_id: question.id,
      selected_option_index: userAnswers[question.id],
    }));
    try {
      const result = await submitQuizApi({
        participant_name: 'Heritage Explorer',
        difficulty,
        answers,
      }, answerFeedback);
      setQuizResult(result);
    } catch (submitError) {
      console.error('Failed submitting quiz:', submitError);
      setError(isTamil ? 'முடிவுகளைச் சேமிக்க முடியவில்லை. மீண்டும் முயற்சிக்கவும்.' : 'Could not submit your results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  const activeQuestion = questions[currentIdx];
  const answeredCount = Object.keys(answerFeedback).length;
  const progress = questions.length ? Math.round((answeredCount / questions.length) * 100) : 0;
  const activeOptions = activeQuestion
    ? (isTamil ? activeQuestion.options_ta : activeQuestion.options_en)
    : [];
  const activeFeedback = activeQuestion ? answerFeedback[activeQuestion.id] : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <header className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-heritage-gold/20 text-heritage-gold-dark text-xs font-bold uppercase tracking-widest border border-heritage-gold/30">
          <Award className="w-3.5 h-3.5" />
          <span>{isTamil ? 'தமிழ்நாடு கலாச்சார வினாடி-வினா' : 'Tamil Nadu Cultural Heritage Quiz'}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-heritage-navy-950">
          {isTamil ? 'உங்கள் வரலாற்று அறிவை சோதியுங்கள்' : 'Test Your Heritage Knowledge'}
        </h1>
        <p className="text-sm text-heritage-navy-800/80 leading-relaxed">
          {isTamil
            ? 'தமிழகத்தின் கோயில்கள், கோட்டைகள், சோழர் வரலாறு மற்றும் கட்டிடக்கலையைப் பற்றி அறிந்து கொள்ளுங்கள்.'
            : 'Explore Tamil Nadu’s dynasties, temples, forts, culture, and architectural heritage.'}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <label htmlFor="quiz-difficulty" className="text-sm font-semibold text-heritage-navy-800">
            {copy.difficulty}
          </label>
          <select
            id="quiz-difficulty"
            value={difficulty}
            onChange={event => {
              const nextDifficulty = event.target.value;
              setDifficulty(nextDifficulty);
              loadQuestions(nextDifficulty);
            }}
            disabled={isLoading || isSubmitting}
            className="rounded-xl border border-heritage-gold/50 bg-white px-4 py-2 text-sm font-semibold text-heritage-navy-900 focus:outline-none focus:ring-2 focus:ring-heritage-gold"
          >
            {DIFFICULTIES.map(level => (
              <option key={level} value={level}>{difficultyLabels[level]}</option>
            ))}
          </select>
        </div>
      </header>
      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-900">
          <span className="flex items-center gap-2"><AlertCircle className="h-4 w-4 shrink-0" />{error}</span>
          {(isLoading || !questions.length) && (
            <button type="button" onClick={() => loadQuestions()} className="shrink-0 font-bold underline">
              {copy.tryAgain}
            </button>
          )}
        </div>
      )}
      {isLoading ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-heritage-cream-300 shadow-md">
          <div className="text-3xl animate-bounce mb-3">🏛️</div>
          <p className="text-sm text-heritage-navy-700">{copy.loading}</p>
        </div>
      ) : quizResult ? (
        <section className="space-y-8 animate-fade-in">
          <div className="bg-heritage-navy-950 text-heritage-cream-100 rounded-3xl p-8 sm:p-12 border-2 border-heritage-gold shadow-2xl text-center space-y-6 gold-glow">
            <div className="w-20 h-20 mx-auto rounded-full bg-heritage-gold/20 border-2 border-heritage-gold flex items-center justify-center text-heritage-gold">
              <Trophy className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-heritage-gold font-bold">
                {isTamil ? 'உங்கள் வினாடி-வினா முடிவு' : `${difficultyLabels[difficulty]} Quiz Results`}
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold gold-gradient-text">
                {isTamil ? quizResult.rank_title_ta : quizResult.rank_title_en}
              </h2>
              <p className="text-sm text-heritage-cream-300">
                {isTamil
                  ? `மதிப்பெண்: ${quizResult.score} / ${quizResult.total} (${quizResult.percentage}%)`
                  : `Score: ${quizResult.score} out of ${quizResult.total} (${quizResult.percentage}%)`}
              </p>
            </div>
            <button type="button" onClick={() => loadQuestions(difficulty)} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-heritage-gold text-heritage-navy-950 font-serif font-bold text-xs uppercase tracking-wider hover:bg-white transition shadow-lg">
              <RotateCcw className="w-4 h-4" />
              <span>{copy.restart}</span>
            </button>
          </div>
          <div className="space-y-4">
            <h3 className="font-serif text-xl font-bold text-heritage-navy-950">{isTamil ? 'வரலாற்று விளக்கங்கள்' : 'Answer Review'}</h3>
            {quizResult.feedback.map((feedback, index) => {
              const question = questions.find(item => item.id === feedback.question_id);
              const options = question ? (isTamil ? question.options_ta : question.options_en) : [];
              return (
                <article key={feedback.question_id} className={`p-5 sm:p-6 rounded-2xl border space-y-2 ${feedback.correct ? 'bg-emerald-50/50 border-emerald-300' : 'bg-rose-50/50 border-rose-300'}`}>
                  <div className="flex items-center justify-between gap-2 text-xs font-bold">
                    <span className="uppercase tracking-wider">{copy.question} {index + 1}</span>
                    <span className={`flex items-center gap-1 ${feedback.correct ? 'text-emerald-700' : 'text-rose-700'}`}>
                      {feedback.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {feedback.correct ? copy.correct : copy.incorrect}
                    </span>
                  </div>
                  <p className="font-serif font-bold text-sm text-heritage-navy-950">{isTamil ? question?.question_ta : question?.question_en}</p>
                  <p className="text-xs text-heritage-navy-800 leading-relaxed bg-white/80 p-3 rounded-xl border border-heritage-cream-300">
                    <span className="font-bold text-heritage-gold-dark block mb-0.5">{isTamil ? 'சரியான விடை' : 'Correct answer'}: {options[feedback.correct_index]}</span>
                    {isTamil ? feedback.explanation_ta : feedback.explanation_en}
                  </p>
                </article>
              );
            })}
          </div>
        </section>
      ) : activeQuestion ? (
        <section className="bg-white rounded-3xl border border-heritage-gold/40 shadow-xl p-6 sm:p-10 space-y-7">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-heritage-gold-dark">{copy.question} {currentIdx + 1} / {questions.length}</span>
              <span className="text-xs font-semibold bg-heritage-cream-100 px-3 py-1 rounded-full text-heritage-navy-800 border border-heritage-cream-300">{activeQuestion.topic || activeQuestion.dynasty}</span>
            </div>
            <div className="h-2.5 rounded-full bg-heritage-cream-200 overflow-hidden" role="progressbar" aria-label={copy.progress} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
              <div className="h-full rounded-full bg-heritage-gold transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-heritage-navy-700"><span>{copy.progress}</span><span>{answeredCount} / {questions.length}</span></div>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-heritage-navy-950 leading-relaxed">{isTamil ? activeQuestion.question_ta : activeQuestion.question_en}</h2>
          <div className="space-y-3">
            {activeOptions.map((option, optionIndex) => {
              const isSelected = userAnswers[activeQuestion.id] === optionIndex;
              const isCorrectOption = activeFeedback?.correct_index === optionIndex;
              const selectedIncorrectly = activeFeedback && isSelected && !activeFeedback.correct;
              return (
                <button key={`${activeQuestion.id}-${optionIndex}`} type="button" onClick={() => handleSelectOption(activeQuestion.id, optionIndex)} disabled={Boolean(activeFeedback) || checkingQuestionId !== null} aria-pressed={isSelected} className={`w-full flex items-center justify-between gap-3 p-4 rounded-2xl border text-left text-sm font-medium transition-all disabled:cursor-default ${isCorrectOption ? 'bg-emerald-50 text-emerald-950 border-emerald-400' : selectedIncorrectly ? 'bg-rose-50 text-rose-950 border-rose-400' : isSelected ? 'bg-heritage-navy-950 text-heritage-gold border-heritage-gold shadow-md' : 'bg-heritage-cream-50 text-heritage-navy-900 border-heritage-cream-300 hover:border-heritage-gold/60'}`}>
                  <span className="flex items-center gap-3"><span className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-xs font-bold ${isSelected ? 'bg-heritage-gold text-heritage-navy-950' : 'bg-heritage-cream-200 text-heritage-navy-800'}`}>{String.fromCharCode(65 + optionIndex)}</span><span>{option}</span></span>
                  {isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
                  {selectedIncorrectly && <XCircle className="w-5 h-5 text-rose-600 shrink-0" />}
                  {checkingQuestionId === activeQuestion.id && isSelected && (<span className="w-4 h-4 shrink-0 rounded-full border-2 border-current border-t-transparent animate-spin" />)}
                </button>
              );
            })}
          </div>
          {activeFeedback && (<div role="status" className={`rounded-xl border p-4 text-sm ${activeFeedback.correct ? 'border-emerald-300 bg-emerald-50 text-emerald-900' : 'border-amber-300 bg-amber-50 text-amber-950'}`}><p className="font-bold">{activeFeedback.correct ? copy.correct : copy.incorrect}</p><p className="mt-1">{isTamil ? activeFeedback.explanation_ta : activeFeedback.explanation_en}</p></div>)}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-heritage-cream-300">
            <button type="button" onClick={handlePrevious} disabled={currentIdx === 0 || checkingQuestionId !== null} className="px-5 py-2.5 rounded-xl border border-heritage-cream-300 text-xs font-semibold text-heritage-navy-700 hover:bg-heritage-cream-100 disabled:opacity-40 transition">{copy.previous}</button>
            {currentIdx < questions.length - 1 ? (
              <button type="button" onClick={handleNext} disabled={!activeFeedback || checkingQuestionId !== null} className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-heritage-navy-900 text-heritage-gold font-serif text-xs font-bold uppercase tracking-wider hover:bg-heritage-gold hover:text-heritage-navy-950 disabled:opacity-40 disabled:hover:bg-heritage-navy-900 disabled:hover:text-heritage-gold transition shadow-sm"><span>{copy.next}</span><ArrowRight className="w-3.5 h-3.5" /></button>
            ) : (
              <button type="button" onClick={handleSubmitQuiz} disabled={answeredCount !== questions.length || isSubmitting} className="flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-heritage-gold via-heritage-gold-accent to-heritage-gold text-heritage-navy-950 font-serif font-bold text-xs uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition shadow-lg gold-glow disabled:opacity-50 disabled:hover:scale-100"><Trophy className="w-4 h-4" /><span>{isSubmitting ? copy.loading : copy.submit}</span></button>
            )}
          </div>
        </section>
      ) : !error ? (<div className="text-center py-16 bg-white rounded-3xl border border-heritage-cream-300 shadow-md"><p className="text-sm text-heritage-navy-700">{copy.noQuestions}</p></div>) : null}
    </div>
  );
}