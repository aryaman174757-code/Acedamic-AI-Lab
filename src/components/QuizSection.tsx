import { useState, useEffect } from 'react';
import { quizQuestions as defaultQuestions } from '../data/notesData';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw, ArrowRight, Zap, Sparkles } from 'lucide-react';
import { QuizQuestion, AppTheme } from '../types';

interface QuizSectionProps {
  questions?: QuizQuestion[];
  activeTheme?: AppTheme | null;
}

export default function QuizSection({ questions = defaultQuestions, activeTheme = null }: QuizSectionProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [hasSubmitted, setHasHasSubmitted] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [isQuizDone, setIsQuizDone] = useState<boolean>(false);

  // Auto-restart quiz when questions change
  useEffect(() => {
    restartQuiz();
  }, [questions]);

  const activeQuestion = questions[currentIdx] || questions[0];

  const handleOptionSelect = (opt: string) => {
    if (hasSubmitted) return;
    setSelectedAns(opt);
  };

  const handleSubmit = () => {
    if (!selectedAns || hasSubmitted || !activeQuestion) return;
    setHasHasSubmitted(true);

    const isCorrect = selectedAns === activeQuestion.correctAnswer;
    if (isCorrect) {
      setCorrectCount(prev => prev + 1);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    setSelectedAns(null);
    setHasHasSubmitted(false);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setIsQuizDone(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedAns(null);
    setHasHasSubmitted(false);
    setCorrectCount(0);
    setStreak(0);
    setIsQuizDone(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <div className="text-center p-8 bg-white border border-slate-200 rounded-lg">
        <p className="text-xs text-slate-500 font-medium">No quiz questions loaded.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {isQuizDone ? (
        // Score Summary Pane styled with Clean Minimalism
        <div className="bg-white border border-slate-200 rounded-lg p-8 text-center text-slate-900 shadow-sm relative overflow-hidden">
          <div className="inline-flex items-center justify-center p-4 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-600 mb-4">
            <Award className="w-12 h-12" />
          </div>

          <h3 className="text-xl font-bold tracking-tight text-slate-900 font-sans">Quiz Session Completed!</h3>
          <p className="text-slate-400 text-xs mt-1 font-semibold">Excellent prep work. You have consolidated your course notes.</p>

          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto my-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Final Score</span>
              <p className="text-3xl font-extrabold text-indigo-600 mt-1">
                {correctCount} <span className="text-lg text-slate-400 font-normal">/ {questions.length}</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-1 font-semibold">({Math.round((correctCount / questions.length) * 100)}% Accuracy)</p>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex flex-col justify-center items-center">
              <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest block">Prep Status</span>
              <p className="text-sm font-bold text-indigo-600 mt-2 bg-indigo-50 border border-indigo-100/50 px-2.5 py-1 rounded-md">
                {correctCount >= questions.length - 2 ? '🏆 Scholar' : '📖 Prep Ready'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1.5 font-semibold">Ready for exam boards</p>
            </div>
          </div>

          <button
            onClick={restartQuiz}
            className="inline-flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-md transition-all cursor-pointer shadow-sm shadow-indigo-100"
          >
            <RotateCcw className="w-4 h-4" /> Restart Self-Assessment
          </button>
        </div>
      ) : (
        // Active Question View
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
          {/* Top progress bar */}
          <div className="flex items-center justify-between gap-4 mb-4">
            <span className="text-[9px] text-slate-400 font-bold tracking-widest uppercase">
              Question {currentIdx + 1} of {questions.length}
            </span>
            <div className="flex items-center gap-1 text-[9px] text-indigo-700 bg-indigo-50 border border-indigo-100 font-bold px-2 py-0.5 rounded-md">
              <Zap className="w-3.5 h-3.5 text-indigo-600" /> {streak} Correct Streak
            </div>
          </div>

          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden mb-6">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question Text */}
          {activeQuestion && (
            <>
              <div className="flex items-start gap-3">
                <HelpCircle className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <h4 className="text-sm font-bold text-slate-800 leading-snug">{activeQuestion.question}</h4>
              </div>

              {/* Answer Options Grid */}
              <div className="mt-6 space-y-2.5">
                {activeQuestion.options?.map((opt, oIdx) => {
                  const isSelected = selectedAns === opt;
                  const isCorrectAnswer = opt === activeQuestion.correctAnswer;
                  
                  let optionClass = 'border-slate-200 hover:bg-slate-50 text-slate-700 bg-white';
                  if (isSelected && !hasSubmitted) {
                    optionClass = 'border-indigo-600 bg-indigo-50 text-indigo-900';
                  } else if (hasSubmitted) {
                    if (isCorrectAnswer) {
                      optionClass = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                    } else if (isSelected) {
                      optionClass = 'border-red-300 bg-red-50 text-red-950 line-through';
                    } else {
                      optionClass = 'border-slate-100 opacity-60 bg-white text-slate-400';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleOptionSelect(opt)}
                      disabled={hasSubmitted}
                      className={`w-full text-left px-4 py-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${optionClass}`}
                    >
                      <span>{opt}</span>
                      {hasSubmitted && isCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {hasSubmitted && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Action Row */}
              <div className="mt-6 flex flex-col gap-4">
                {!hasSubmitted ? (
                  <button
                    onClick={handleSubmit}
                    disabled={!selectedAns}
                    className={`w-full py-2.5 rounded-md font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      selectedAns
                        ? 'bg-slate-900 text-white shadow-sm hover:bg-slate-800'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    Validate Choice
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-bold text-xs shadow-sm shadow-indigo-100 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {currentIdx + 1 === questions.length ? 'Finish Assessment' : 'Next Question'}{' '}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                {/* Dynamic Explanation callout */}
                {hasSubmitted && activeQuestion.explanation && (
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-600 mt-2">
                    <p className="font-bold text-slate-800 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-600" /> Mathematical Explanation
                    </p>
                    <p className="mt-1.5 leading-relaxed font-medium">{activeQuestion.explanation}</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
