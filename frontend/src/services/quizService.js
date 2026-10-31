import { request } from './api';

export const FALLBACK_QUESTIONS = [
  { id: 1, dynasty: "Chola", question_en: "What is the weight of the Kumbam on Thanjavur Big Temple?", question_ta: "தஞ்சைப் பெரிய கோயில் கும்பத்தின் எடை?", options_en: ["25 Tonnes","80 Tonnes","120 Tonnes","200 Tonnes"], options_ta: ["25 டன்","80 டன்","120 டன்","200 டன்"], correct_index: 1, explanation_en: "80 tonnes monolithic stone.", explanation_ta: "80 டன் ஒற்றை கல்.", difficulty: "Beginner", topic: "Thanjavur" },
  { id: 2, dynasty: "Pallava", question_en: "Who built Pancha Rathas in Mamallapuram?", question_ta: "பஞ்ச ரதங்களை கட்டியவர்?", options_en: ["Mahendravarman I","Narasimhavarman I","Rajasimha","Aparajita"], options_ta: ["மகேந்திரவர்மன்","நரசிம்மவர்மன்","ராஜசிம்மன்","அபராஜிதன்"], correct_index: 1, explanation_en: "Narasimhavarman I - Mamalla", explanation_ta: "மாமல்லன்", difficulty: "Beginner", topic: "Mamallapuram" },
  { id: 3, dynasty: "Pandya", question_en: "Meenakshi Temple is famous for?", question_ta: "மீனாட்சி கோயில் எதற்கு புகழ்?", options_en: ["1000 Pillar Hall","Tall Gopurams","Underground shrine","Golden Vimana"], options_ta: ["1000 தூண்","உயர்ந்த கோபுரம்","நிலத்தடி","தங்க விமானம்"], correct_index: 1, explanation_en: "14 Gopurams", explanation_ta: "14 கோபுரங்கள்", difficulty: "Beginner", topic: "Madurai" },
  { id: 4, dynasty: "Chola", question_en: "Who built Gangaikonda Cholapuram?", question_ta: "கங்கைகொண்ட சோழபுரம் கட்டியவர்?", options_en: ["Raja Raja I","Rajendra I","Kulothunga I","Raja Raja II"], options_ta: ["ராஜராஜன்","ராஜேந்திரன்","குலோத்துங்கன்","2ம் ராஜராஜன்"], correct_index: 1, explanation_en: "Rajendra Chola I", explanation_ta: "ராஜேந்திர சோழன்", difficulty: "Intermediate", topic: "Gangaikonda Cholapuram" },
  { id: 5, dynasty: "Pallava", question_en: "Shore Temple is dedicated to?", question_ta: "கடற்கரை கோயில் யாருக்கு?", options_en: ["Vishnu","Shiva","Murugan","Durga"], options_ta: ["விஷ்ணு","சிவன்","முருகன்","துர்க்கை"], correct_index: 1, explanation_en: "Lord Shiva", explanation_ta: "சிவன்", difficulty: "Intermediate", topic: "Shore Temple" },
  { id: 6, dynasty: "Chola", question_en: "Airavatesvara Temple is at?", question_ta: "ஐராவதேஸ்வரர் கோயில் எங்கு?", options_en: ["Darasuram","Thanjavur","Kanchipuram","Chidambaram"], options_ta: ["தாராசுரம்","தஞ்சை","காஞ்சி","சிதம்பரம்"], correct_index: 0, explanation_en: "Darasuram", explanation_ta: "தாராசுரம்", difficulty: "Intermediate", topic: "Darasuram" },
  { id: 7, dynasty: "Chola", question_en: "Special about Thanjavur Big Temple shadow?", question_ta: "பெரிய கோயில் நிழல் சிறப்பு?", options_en: ["Falls north only","Shadow never falls on ground","Always circular","Changes color"], options_ta: ["வடக்கில் மட்டும்","நிழல் தரையில் விழாது","வட்டம்","நிறம் மாறும்"], correct_index: 1, explanation_en: "Shadow never on ground", explanation_ta: "நிழல் தரையில் விழாது", difficulty: "Advanced", topic: "Thanjavur" },
  { id: 8, dynasty: "Pandya", question_en: "Oldest inscription in Tamil Nadu?", question_ta: "பழமையான கல்வெட்டு?", options_en: ["Tamil-Brahmi","Grantha","Vatteluttu","Devanagari"], options_ta: ["தமிழ்-பிராமி","கிரந்தம்","வட்டெழுத்து","தேவநாகரி"], correct_index: 0, explanation_en: "3rd century BCE Tamil-Brahmi", explanation_ta: "கிமு 3ம் நூற்றாண்டு", difficulty: "Advanced", topic: "Inscriptions" },
  { id: 9, dynasty: "Pallava", question_en: "Kailasanathar Temple built by?", question_ta: "கைலாசநாதர் கோயில் கட்டியவர்?", options_en: ["Narasimhavarman I","Rajasimha","Mahendravarman","Dantivarman"], options_ta: ["நரசிம்மவர்மன் 1","ராஜசிம்மன்","மகேந்திரவர்மன்","தந்திவர்மன்"], correct_index: 1, explanation_en: "Rajasimha around 700 CE", explanation_ta: "கிபி 700ல் ராஜசிம்மன்", difficulty: "Advanced", topic: "Kanchipuram" },
  { id: 10, dynasty: "Cheras", question_en: "Brihadeeswarar Temple built in which century?", question_ta: "பிரகதீஸ்வரர் கோயில் எந்த நூற்றாண்டு?", options_en: ["9th","11th","13th","15th"], options_ta: ["9ம்","11ம்","13ம்","15ம்"], correct_index: 1, explanation_en: "1010 CE 11th century", explanation_ta: "கிபி 1010", difficulty: "Advanced", topic: "Thanjavur" }
];

export const fetchQuizQuestions = async (params = {}) => {
  let difficultyParam = '';
  let languageParam = 'en';
  
  if (typeof params === 'string') {
    difficultyParam = params;
  } else if (params && typeof params === 'object') {
    difficultyParam = params.difficulty || params.level || '';
    languageParam = params.language || 'en';
  }

  try {
    const data = await request(`/quiz?difficulty=${difficultyParam}&language=${languageParam}`);
    if (data && data.length > 0) return data;
  } catch (e) {}

  const diff = difficultyParam.toLowerCase().trim();
  
  if (diff === 'beginner') {
    return FALLBACK_QUESTIONS.filter(q => q.difficulty === 'Beginner');
  } else if (diff === 'intermediate' || diff === 'medium') {
    return FALLBACK_QUESTIONS.filter(q => q.difficulty === 'Intermediate');
  } else if (diff === 'advanced' || diff === 'difficult' || diff === 'hard') {
    return FALLBACK_QUESTIONS.filter(q => q.difficulty === 'Advanced');
  }
  return FALLBACK_QUESTIONS;
};

export const checkQuizAnswer = (payload, activeQuestion) => {
  let questionId, selectedIndex;
  if (typeof payload === 'object' && payload !== null) {
    if ('question_id' in payload) {
      questionId = payload.question_id;
      selectedIndex = payload.selected_option_index;
    } else {
      questionId = payload.questionId || payload.id;
      selectedIndex = payload.selectedIndex;
    }
  } else {
    questionId = payload;
    selectedIndex = activeQuestion;
  }
  const q = FALLBACK_QUESTIONS.find(x => x.id === questionId);
  if (!q) return { correct: false, correct_index: 0, explanation_en: "", explanation_ta: "" };
  const isCorrect = q.correct_index === selectedIndex;
  return {
    correct: isCorrect,
    correct_index: q.correct_index,
    explanation_en: q.explanation_en,
    explanation_ta: q.explanation_ta
  };
};

export const submitQuizApi = async (payload) => {
  try {
    return await request('/quiz/submit', { method: 'POST', body: payload });
  } catch (e) {
    const score = payload.answers.filter(a => {
      const qq = FALLBACK_QUESTIONS.find(q => q.id === a.question_id);
      return qq && qq.correct_index === a.selected_option_index;
    }).length;
    const feedback = payload.answers.map(a => {
      const qq = FALLBACK_QUESTIONS.find(q => q.id === a.question_id);
      return {
        question_id: a.question_id,
        correct: qq ? qq.correct_index === a.selected_option_index : false,
        correct_index: qq ? qq.correct_index : 0,
        explanation_en: qq ? qq.explanation_en : "",
        explanation_ta: qq ? qq.explanation_ta : ""
      };
    });
    const percentage = Math.round((score / payload.answers.length) * 100);
    let rank_en = "Beginner Explorer";
    let rank_ta = "தொடக்க நிலை ஆய்வாளர்";
    if (percentage >= 80) { rank_en = "Heritage Master"; rank_ta = "பாரம்பரிய வல்லுநர்"; }
    else if (percentage >= 50) { rank_en = "Temple Scholar"; rank_ta = "கோயில் அறிஞர்"; }
    return {
      score,
      total: payload.answers.length,
      percentage,
      rank_title_en: rank_en,
      rank_title_ta: rank_ta,
      feedback
    };
  }
};