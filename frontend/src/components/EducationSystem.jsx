import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { EDUCATION_MODULES } from '../data/educationData';
import confetti from 'canvas-confetti';
import {
  GraduationCap,
  BookOpen,
  CheckCircle,
  Award,
  HelpCircle,
  ArrowRight,
  Clock,
  Sparkles,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const EducationSystem = () => {
  const { completedLessons, markLessonComplete, quizResults, saveQuizScore } = useCrypto();

  const [selectedLevel, setSelectedLevel] = useState('All');
  const [activeModule, setActiveModule] = useState(EDUCATION_MODULES[0]);
  const [activeLesson, setActiveLesson] = useState(EDUCATION_MODULES[0].lessons[0]);

  // Quiz Modal State
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizModule, setQuizModule] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(0);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredModules = EDUCATION_MODULES.filter((m) =>
    selectedLevel === 'All' ? true : m.level.toLowerCase() === selectedLevel.toLowerCase()
  );

  // Overall Stats
  const totalLessons = EDUCATION_MODULES.reduce((acc, m) => acc + m.lessons.length, 0);
  const progressPercent = Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
  const quizzesPassedCount = Object.values(quizResults).filter((r) => r.passed).length;
  const userXP = completedLessons.length * 50 + quizzesPassedCount * 150;

  // Open Quiz
  const handleStartQuiz = (module) => {
    setQuizModule(module);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setIsQuizOpen(true);
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    if (!quizModule) return;
    const questions = quizModule.quiz.questions;
    let correctCount = 0;

    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / questions.length) * 100);
    const passed = scorePct >= quizModule.quiz.passingScore;

    setQuizScore(scorePct);
    setQuizSubmitted(true);
    saveQuizScore(quizModule.quiz.id, scorePct, passed);

    if (passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        // Confetti fallback
      }
    }
  };

  return (
    <div className="education-page">
      {/* 1. Academy Hero / Progress Header */}
      <div className="academy-header-card">
        <div className="academy-header-info">
          <div className="academy-title-row">
            <div className="academy-icon-box">
              <GraduationCap size={28} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="academy-heading">NeuroCrypto Learning Academy</h2>
              <p className="academy-sub">
                Comprehensive curriculum from cryptographic primitives to machine-learning time series modeling.
              </p>
            </div>
          </div>

          <div className="academy-progress-wrapper">
            <div className="academy-progress-top">
              <span>Overall Course Completion</span>
              <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="academy-stats-col">
          <div className="academy-stat-pill">
            <Sparkles size={16} className="text-amber-400" />
            <div>
              <span className="stat-label">Total Academy XP</span>
              <span className="stat-val text-amber-400 font-mono">{userXP} XP</span>
            </div>
          </div>

          <div className="academy-stat-pill">
            <Award size={16} className="text-emerald-400" />
            <div>
              <span className="stat-label">Quizzes Passed</span>
              <span className="stat-val text-emerald-400 font-mono">
                {quizzesPassedCount} / {EDUCATION_MODULES.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Level Filter Tabs */}
      <div className="level-filter-bar">
        <div className="category-pills">
          {levels.map((lvl) => (
            <button
              key={lvl}
              className={`cat-pill ${selectedLevel === lvl ? 'active' : ''}`}
              onClick={() => setSelectedLevel(lvl)}
            >
              {lvl} Modules
            </button>
          ))}
        </div>
      </div>

      {/* 3. Main Split View: Modules List & Interactive Lesson Reader */}
      <div className="academy-split-view">
        {/* Left: Modules Accordion List */}
        <div className="modules-sidebar">
          <h3 className="sidebar-heading">Learning Pathways</h3>
          <div className="modules-list">
            {filteredModules.map((module) => {
              const isSelected = activeModule.id === module.id;
              const quizRecord = quizResults[module.quiz.id];
              const isModuleCompleted = module.lessons.every((l) =>
                completedLessons.includes(l.id)
              );

              return (
                <div
                  key={module.id}
                  className={`module-item-card ${isSelected ? 'active' : ''}`}
                  onClick={() => {
                    setActiveModule(module);
                    setActiveLesson(module.lessons[0]);
                  }}
                >
                  <div className="module-item-top">
                    <span className={`level-tag level-${module.level.toLowerCase()}`}>
                      {module.level}
                    </span>
                    <span className="read-time text-xs text-muted">
                      <Clock size={12} className="inline mr-1" />
                      {module.readTime}
                    </span>
                  </div>

                  <h4 className="module-item-title">{module.title}</h4>
                  <p className="module-item-desc">{module.description}</p>

                  <div className="module-item-footer">
                    <span className="lessons-count text-xs text-muted">
                      <BookOpen size={13} className="inline mr-1" />
                      {module.lessons.length} Lessons
                    </span>

                    {quizRecord && quizRecord.passed ? (
                      <span className="passed-badge">
                        <CheckCircle size={13} /> Quiz Passed ({quizRecord.score}%)
                      </span>
                    ) : (
                      <button
                        className="btn-take-quiz-sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartQuiz(module);
                        }}
                      >
                        <HelpCircle size={13} /> Quiz
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Lesson Reader */}
        <div className="lesson-reader-panel">
          <div className="lesson-reader-header">
            <div className="lesson-header-meta">
              <span className={`level-tag level-${activeModule.level.toLowerCase()}`}>
                {activeModule.level}
              </span>
              <span className="text-muted text-xs">• {activeModule.title}</span>
            </div>
            <h2 className="lesson-title">{activeLesson.title}</h2>

            {/* Lesson switcher pills */}
            <div className="lesson-nav-tabs">
              {activeModule.lessons.map((lesson, idx) => {
                const isCurrent = activeLesson.id === lesson.id;
                const isDone = completedLessons.includes(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    className={`lesson-tab ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
                    onClick={() => setActiveLesson(lesson)}
                  >
                    <span>Part {idx + 1}: {lesson.title}</span>
                    {isDone && <CheckCircle size={13} className="text-emerald-400 ml-1 inline" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lesson-body-content">
            {activeLesson.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx} className="lesson-paragraph">
                {paragraph}
              </p>
            ))}

            {/* Key Takeaway Box */}
            <div className="key-takeaway-card">
              <div className="takeaway-head">
                <Sparkles size={16} className="text-amber-400" />
                <span>Core Takeaway</span>
              </div>
              <p className="takeaway-text">{activeLesson.keyTakeaway}</p>
            </div>
          </div>

          {/* Lesson Footer Actions */}
          <div className="lesson-reader-footer">
            <button
              className={`btn-complete-lesson ${completedLessons.includes(activeLesson.id) ? 'completed' : ''}`}
              onClick={() => markLessonComplete(activeLesson.id)}
            >
              <CheckCircle size={16} />
              <span>
                {completedLessons.includes(activeLesson.id)
                  ? 'Lesson Completed (+50 XP)'
                  : 'Mark as Completed (+50 XP)'}
              </span>
            </button>

            <button
              className="btn-launch-module-quiz"
              onClick={() => handleStartQuiz(activeModule)}
            >
              <HelpCircle size={16} />
              <span>Take {activeModule.title} Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Interactive Quiz Modal */}
      {isQuizOpen && quizModule && (
        <div className="modal-backdrop" onClick={() => setIsQuizOpen(false)}>
          <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quiz-modal-header">
              <div className="flex items-center gap-2">
                <GraduationCap size={22} className="text-cyan-400" />
                <div>
                  <h3 className="quiz-title">{quizModule.quiz.title}</h3>
                  <span className="text-xs text-muted">
                    Passing criteria: {quizModule.quiz.passingScore}%
                  </span>
                </div>
              </div>
              <button className="btn-close-modal" onClick={() => setIsQuizOpen(false)}>
                ✕
              </button>
            </div>

            <div className="quiz-modal-body">
              {!quizSubmitted ? (
                <div className="quiz-in-progress">
                  <div className="quiz-progress-text">
                    Question {currentQuestionIndex + 1} of {quizModule.quiz.questions.length}
                  </div>

                  {(() => {
                    const q = quizModule.quiz.questions[currentQuestionIndex];
                    const selectedOpt = selectedAnswers[currentQuestionIndex];

                    return (
                      <div className="question-container">
                        <h4 className="question-text">{q.question}</h4>
                        <div className="quiz-options-list">
                          {q.options.map((opt, optIdx) => (
                            <button
                              key={optIdx}
                              className={`quiz-option-btn ${selectedOpt === optIdx ? 'selected' : ''}`}
                              onClick={() => handleSelectOption(currentQuestionIndex, optIdx)}
                            >
                              <span className="opt-marker">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span className="opt-text">{opt}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })()}

                  <div className="quiz-nav-row">
                    <button
                      className="btn-quiz-prev"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => prev - 1)}
                    >
                      Previous
                    </button>

                    {currentQuestionIndex < quizModule.quiz.questions.length - 1 ? (
                      <button
                        className="btn-quiz-next"
                        onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        className="btn-quiz-submit"
                        onClick={handleSubmitQuiz}
                        disabled={
                          Object.keys(selectedAnswers).length <
                          quizModule.quiz.questions.length
                        }
                      >
                        Submit Quiz
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Result Score View */
                <div className="quiz-result-view">
                  <div className={`quiz-score-circle ${quizScore >= quizModule.quiz.passingScore ? 'passed' : 'failed'}`}>
                    <span className="score-val">{quizScore}%</span>
                    <span className="score-label">
                      {quizScore >= quizModule.quiz.passingScore ? 'PASSED' : 'RETRY'}
                    </span>
                  </div>

                  <h3 className="result-headline">
                    {quizScore >= quizModule.quiz.passingScore
                      ? '🎉 Outstanding! Module Mastery Confirmed!'
                      : 'Keep Practicing! Review the Lessons and Try Again.'}
                  </h3>

                  <div className="question-explanations-list">
                    {quizModule.quiz.questions.map((q, qIdx) => {
                      const userChoice = selectedAnswers[qIdx];
                      const isCorrect = userChoice === q.correctIndex;

                      return (
                        <div
                          key={qIdx}
                          className={`explanation-item ${isCorrect ? 'correct' : 'incorrect'}`}
                        >
                          <div className="exp-top">
                            <span className="font-semibold text-sm">
                              Q{qIdx + 1}: {q.question}
                            </span>
                            <span className={`exp-status ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                              {isCorrect ? '✓ Correct (+50 XP)' : '✗ Incorrect'}
                            </span>
                          </div>
                          <p className="exp-detail text-xs text-muted mt-1">
                            <strong>Explanation:</strong> {q.explanation}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="quiz-result-actions">
                    <button
                      className="btn-retake-quiz"
                      onClick={() => {
                        setSelectedAnswers({});
                        setQuizSubmitted(false);
                        setCurrentQuestionIndex(0);
                      }}
                    >
                      <RotateCcw size={15} /> Retake Quiz
                    </button>
                    <button
                      className="btn-close-result"
                      onClick={() => setIsQuizOpen(false)}
                    >
                      Done & Return
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
