import React, { useState } from 'react';
import { useCrypto } from '../context/CryptoContext';
import { EDUCATION_MODULES, FACULTY_MEMBERS } from '../data/educationData';
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
  Users,
  Mail,
  Calendar,
  Send,
  UserCheck,
  BrainCircuit,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Bot
} from 'lucide-react';

export const EducationSystem = () => {
  const { completedLessons, markLessonComplete, quizResults, saveQuizScore } = useCrypto();

  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'quizzes' | 'faculty'
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

  // Teacher Consultation / Q&A State
  const [selectedFacultyId, setSelectedFacultyId] = useState(FACULTY_MEMBERS[0].id);
  const [teacherQuery, setTeacherQuery] = useState('');
  const [teacherConsultationLog, setTeacherConsultationLog] = useState([
    {
      id: 'welcome-qna',
      teacher: FACULTY_MEMBERS[0].name,
      query: 'What is the most critical concept for crypto beginners to grasp?',
      reply: 'Welcome students! In distributed ledgers, always remember: "Don\'t trust, verify." Understand the asymmetric cryptography securing your private keys before trading or interacting with smart contracts. Feel free to ask me about consensus, Byzantine fault tolerance, or cryptography!'
    }
  ]);
  const [isConsulting, setIsConsulting] = useState(false);

  const levels = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredModules = EDUCATION_MODULES.filter((mod) =>
    selectedLevel === 'All' ? true : mod.level.toLowerCase() === selectedLevel.toLowerCase()
  );

  // Overall Progress Stats
  const totalLessons = EDUCATION_MODULES.reduce((acc, mod) => acc + mod.lessons.length, 0);
  const progressPercent = Math.min(100, Math.round((completedLessons.length / totalLessons) * 100));
  const quizzesPassedCount = Object.values(quizResults).filter((r) => r.passed).length;
  const userXP = completedLessons.length * 50 + quizzesPassedCount * 150;

  // Open Quiz Handler
  const handleStartQuiz = (moduleData) => {
    setQuizModule(moduleData);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setIsQuizOpen(true);
  };

  const handleSelectOption = (questionIndex, optionIndex) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prevState) => ({
      ...prevState,
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

    setQuizSubmitted(true);
    setQuizScore(scorePct);
    saveQuizScore(quizModule.quiz.id, scorePct, passed);

    if (passed) {
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 }
        });
      } catch (err) {}
    }
  };

  // Ask Teacher Consultation Handler
  const handleAskTeacher = (e) => {
    e.preventDefault();
    const query = teacherQuery.trim();
    if (!query || isConsulting) return;

    const faculty = FACULTY_MEMBERS.find((f) => f.id === selectedFacultyId) || FACULTY_MEMBERS[0];
    setIsConsulting(true);

    setTimeout(() => {
      let reply = '';
      const q = query.toLowerCase();

      if (faculty.id === 'tariq-mahmood') {
        if (q.includes('pow') || q.includes('pos') || q.includes('consensus')) {
          reply = `From a distributed systems perspective, Proof-of-Work establishes thermodynamic finality through energy expenditure, ensuring Sybil resistance across open peer-to-peer networks. Proof-of-Stake replaces computation with bonded capital collateral. Both solve the Byzantine Generals Problem under different fault-tolerance assumptions.`;
        } else {
          reply = `That is an excellent research inquiry. In cryptographic protocol design, ensure you evaluate the security boundaries, network gossip latency, and consensus finality guarantees.`;
        }
      } else if (faculty.id === 'farhan-ijaz') {
        if (q.includes('lstm') || q.includes('ai') || q.includes('model') || q.includes('predict')) {
          reply = `Our PyTorch LSTM pipeline uses 10-dimensional input tensors (OHLCV, RSI, MACD, On-Chain flows) and computes 95% Bayesian confidence intervals to capture non-linear stochastic dispersion. Always respect statistical uncertainty bands rather than single-point targets.`;
        } else {
          reply = `Great technical question! When designing financial AI microservices, decoupling the FastAPI inference service from the Express API gateway provides high-throughput asynchronous execution.`;
        }
      } else if (faculty.id === 'zain-ul-abideen') {
        if (q.includes('mql5') || q.includes('bot') || q.includes('grid') || q.includes('dca')) {
          reply = `In algorithmic trading, your edge comes from execution discipline. The RSI bot capitalizes on mean-reversion pullbacks, while Grid bots thrive in choppy channels. In MQL5, always manage your trailing stops and lot sizing inside the OnTick() event loop.`;
        } else {
          reply = `Execution and risk management are paramount! Backtest every algorithm through tick-by-tick simulation accounting for 0.1% transaction fees and order book slippage.`;
        }
      } else {
        // Sarah Jenkins
        reply = `As a portfolio risk principle, never risk more than 1% to 2% of your equity on any trade. Calculate position size using: (Account * Risk %) / (Entry - Stop Loss). Protect your downside first, and the upside will take care of itself.`;
      }

      setTeacherConsultationLog((prev) => [
        ...prev,
        {
          id: `qna-${Date.now()}`,
          teacher: faculty.name,
          query,
          reply
        }
      ]);
      setTeacherQuery('');
      setIsConsulting(false);
    }, 600);
  };

  return (
    <div className="education-page">
      {/* 1. Education Hero & Progress Header */}
      <div className="academy-header-card">
        <div className="academy-header-info">
          <div className="academy-title-row">
            <div className="academy-icon-box">
              <GraduationCap size={28} className="text-cyan-400" />
            </div>
            <div>
              <h2 className="academy-heading">NeuroCrypto Academic Education Center</h2>
              <p className="academy-sub">
                Institutional curriculum accredited by FAST NUCES • Blockchain Cryptography, Quantitative Algorithmic Trading & AI Models.
              </p>
            </div>
          </div>

          <div className="academy-progress-wrapper">
            <div className="academy-progress-top">
              <span>Overall Curriculum Progress</span>
              <span className="font-mono text-cyan-400 font-bold">{progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
            </div>
          </div>
        </div>

        <div className="academy-stats-col">
          <div className="academy-stat-pill">
            <Sparkles size={16} className="text-amber-400" />
            <div>
              <span className="stat-label">Academic XP Points</span>
              <span className="stat-val text-amber-400 font-mono">{userXP} XP</span>
            </div>
          </div>

          <div className="academy-stat-pill">
            <Award size={16} className="text-emerald-400" />
            <div>
              <span className="stat-label">Quizzes Certified</span>
              <span className="stat-val text-emerald-400 font-mono">
                {quizzesPassedCount} / {EDUCATION_MODULES.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top Portal Navigation (Courses, Quizzes, Faculty) */}
      <div className="education-nav-bar">
        <div className="education-tab-buttons">
          <button
            className={`edu-nav-btn ${activeTab === 'courses' ? 'active' : ''}`}
            onClick={() => setActiveTab('courses')}
          >
            <BookOpen size={16} />
            <span>Standard Courses & Lessons ({EDUCATION_MODULES.length})</span>
          </button>

          <button
            className={`edu-nav-btn ${activeTab === 'quizzes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quizzes')}
          >
            <HelpCircle size={16} />
            <span>Interactive Quizzes & Badges</span>
            {quizzesPassedCount > 0 && (
              <span className="edu-badge-count">{quizzesPassedCount}</span>
            )}
          </button>

          <button
            className={`edu-nav-btn ${activeTab === 'faculty' ? 'active' : ''}`}
            onClick={() => setActiveTab('faculty')}
          >
            <Users size={16} />
            <span>Course Faculty & Teachers ({FACULTY_MEMBERS.length})</span>
          </button>
        </div>
      </div>

      {/* 3. TAB 1: COURSES & CURRICULUM */}
      {activeTab === 'courses' && (
        <>
          {/* Level Filter Tabs */}
          <div className="level-filter-bar">
            <div className="category-pills">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  className={`cat-pill ${selectedLevel === lvl ? 'active' : ''}`}
                  onClick={() => setSelectedLevel(lvl)}
                >
                  {lvl} Courses
                </button>
              ))}
            </div>
          </div>

          {/* Split View: Course Sidebar & Lesson Viewer */}
          <div className="academy-split-view">
            {/* Left: Modules Accordion List */}
            <div className="modules-sidebar">
              <h3 className="sidebar-heading">Curriculum Pathways</h3>
              <div className="modules-list">
                {filteredModules.map((module) => {
                  const isSelected = activeModule.id === module.id;
                  const quizRecord = quizResults[module.quiz.id];
                  const completedModuleLessons = module.lessons.filter((l) =>
                    completedLessons.includes(l.id)
                  );
                  const moduleProgress = Math.round(
                    (completedModuleLessons.length / module.lessons.length) * 100
                  );

                  return (
                    <div
                      key={module.id}
                      className={`module-item-card ${isSelected ? 'active' : ''}`}
                      onClick={() => {
                        setActiveLesson(module.lessons[0]);
                        setActiveModule(module);
                      }}
                    >
                      <div className="module-item-top">
                        <span className={`level-tag level-${module.level.toLowerCase()}`}>
                          {module.level}
                        </span>
                        <span className="read-time text-muted text-xs">
                          <Clock size={12} className="inline mr-1" />
                          {module.readTime}
                        </span>
                      </div>

                      <h4 className="module-item-title">{module.title}</h4>
                      <div className="module-instructor-tag">
                        <span className="text-cyan-400">Instructor:</span> {module.instructor}
                      </div>
                      <p className="module-item-desc">{module.description}</p>

                      <div className="module-progress">
                        <div className="module-progress-label">
                          <span>Progress</span>
                          <span>
                            {completedModuleLessons.length}/{module.lessons.length} Lessons
                          </span>
                        </div>
                        <div className="module-progress-track">
                          <div
                            className="module-progress-fill"
                            style={{ width: `${moduleProgress}%` }}
                          />
                        </div>
                      </div>

                      <div className="module-item-footer">
                        <span className="lessons-count text-muted text-xs">
                          <BookOpen size={13} className="inline mr-1" />
                          {module.lessons.length} Lessons
                        </span>

                        {quizRecord && quizRecord.passed ? (
                          <span className="passed-badge">
                            <CheckCircle size={13} /> Certified ({quizRecord.score}%)
                          </span>
                        ) : (
                          <button
                            className="btn-take-quiz-sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartQuiz(module);
                            }}
                          >
                            <HelpCircle size={13} /> Take Quiz
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
                  <span className="instructor-pill-sm">
                    👨‍🏫 {activeModule.instructor}
                  </span>
                </div>
                <h2 className="lesson-title">{activeLesson.title}</h2>

                {/* Lesson Switcher Tabs */}
                <div className="lesson-nav-tabs">
                  {activeModule.lessons.map((lesson, index) => {
                    const isCurrent = activeLesson.id === lesson.id;
                    const isDone = completedLessons.includes(lesson.id);

                    return (
                      <button
                        key={lesson.id}
                        className={`lesson-tab ${isCurrent ? 'active' : ''} ${isDone ? 'done' : ''}`}
                        onClick={() => setActiveLesson(lesson)}
                      >
                        <span>
                          Part {index + 1}: {lesson.title}
                        </span>
                        {isDone && <CheckCircle size={13} className="text-emerald-400 ml-1 inline" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="lesson-body-content">
                {activeLesson.content.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="lesson-paragraph">
                    {paragraph}
                  </p>
                ))}

                {/* Core Takeaway Card */}
                <div className="key-takeaway-card">
                  <div className="takeaway-head">
                    <Sparkles size={16} className="text-amber-400" />
                    <span>Academic Core Principle</span>
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
                      ? 'Lesson Completed (+50 XP Earned)'
                      : 'Mark Lesson as Completed (+50 XP)'}
                  </span>
                </button>

                <button
                  className="btn-launch-module-quiz"
                  onClick={() => handleStartQuiz(activeModule)}
                >
                  <HelpCircle size={16} />
                  <span>Launch Course Certification Quiz</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 4. TAB 2: INTERACTIVE QUIZZES & CERTIFICATIONS */}
      {activeTab === 'quizzes' && (
        <div className="quizzes-hub-section">
          <div className="quizzes-hub-header">
            <div>
              <h3 className="section-title">Course Mastery Quizzes & Certifications</h3>
              <p className="section-sub">
                Score 75% or higher on each standardized multiple-choice examination to earn academic XP and certification badges.
              </p>
            </div>
          </div>

          <div className="quizzes-cards-grid">
            {EDUCATION_MODULES.map((mod) => {
              const quizRecord = quizResults[mod.quiz.id];
              const isPassed = quizRecord?.passed;

              return (
                <div key={mod.quiz.id} className="quiz-hub-card">
                  <div className="quiz-hub-card-top">
                    <span className={`level-tag level-${mod.level.toLowerCase()}`}>{mod.level}</span>
                    <span className="quiz-questions-count">{mod.quiz.questions.length} Questions</span>
                  </div>

                  <h4 className="quiz-hub-title">{mod.quiz.title}</h4>
                  <p className="quiz-hub-course-ref">{mod.title}</p>
                  <div className="quiz-hub-instructor">Instructor: {mod.instructor}</div>

                  <div className="quiz-hub-footer">
                    <div className="quiz-status-col">
                      <span className="text-xs text-muted">Passing Criteria: {mod.quiz.passingScore}%</span>
                      {isPassed ? (
                        <span className="text-emerald-400 font-bold text-xs flex items-center gap-1">
                          <CheckCircle2 size={13} /> Certified ({quizRecord.score}%)
                        </span>
                      ) : (
                        <span className="text-amber-400 text-xs font-semibold">Not Yet Attempted</span>
                      )}
                    </div>

                    <button
                      className="btn-start-quiz-hub"
                      onClick={() => handleStartQuiz(mod)}
                    >
                      <HelpCircle size={14} />
                      <span>{isPassed ? 'Retake Quiz' : 'Start Quiz'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. TAB 3: FACULTY & TEACHERS */}
      {activeTab === 'faculty' && (
        <div className="faculty-hub-section">
          <div className="faculty-hub-header">
            <div>
              <h3 className="section-title">Academic Faculty & Course Instructors</h3>
              <p className="section-sub">
                Our curriculum is designed and taught by leading professors and engineering researchers at FAST NUCES.
              </p>
            </div>
          </div>

          {/* Faculty Profile Cards Grid */}
          <div className="faculty-cards-grid">
            {FACULTY_MEMBERS.map((faculty) => (
              <div key={faculty.id} className="faculty-profile-card">
                <div className="faculty-card-header">
                  <div
                    className="faculty-avatar-circle"
                    style={{ backgroundColor: `${faculty.color}22`, borderColor: faculty.color, color: faculty.color }}
                  >
                    {faculty.avatar}
                  </div>
                  <div className="faculty-identity">
                    <h4 className="faculty-name">{faculty.name}</h4>
                    <span className="faculty-title">{faculty.title}</span>
                    <span className="faculty-dept">{faculty.department}</span>
                  </div>
                </div>

                <div className="faculty-qualification">
                  <strong>Academic Credentials:</strong> {faculty.qualification}
                </div>

                <p className="faculty-bio">{faculty.bio}</p>

                <div className="faculty-specializations">
                  <span className="spec-label">Specializations:</span>
                  <div className="spec-tags">
                    {faculty.specialization.map((spec, sIdx) => (
                      <span key={sIdx} className="spec-tag-item">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="faculty-footer-meta">
                  <div className="meta-item">
                    <Calendar size={13} className="text-cyan-400" />
                    <span>{faculty.officeHours}</span>
                  </div>
                  <div className="meta-item">
                    <Mail size={13} className="text-purple-400" />
                    <span>{faculty.email}</span>
                  </div>
                </div>

                <button
                  className="btn-consult-teacher"
                  onClick={() => {
                    setSelectedFacultyId(faculty.id);
                    document.getElementById('teacher-consultation-box')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <UserCheck size={14} />
                  <span>Consult {faculty.name.split(' ')[0]} {faculty.name.split(' ')[1]}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Interactive Teacher Consultation / Academic Q&A Panel */}
          <div id="teacher-consultation-box" className="teacher-consultation-card">
            <div className="consultation-card-header">
              <div className="flex items-center gap-2">
                <GraduationCap size={22} className="text-cyan-400" />
                <div>
                  <h4 className="consultation-title">Ask Your Professor & Course Instructors</h4>
                  <p className="consultation-sub">
                    Direct academic consultation on cryptographic proofs, time-series forecasting, algorithmic bots, or risk formulas.
                  </p>
                </div>
              </div>
            </div>

            {/* Q&A Exchange Log */}
            <div className="consultation-log">
              {teacherConsultationLog.map((item) => (
                <div key={item.id} className="consultation-log-item">
                  <div className="qna-query-bubble">
                    <span className="qna-author">Student Query:</span>
                    <p>{item.query}</p>
                  </div>
                  <div className="qna-reply-bubble">
                    <span className="qna-teacher-tag">👨‍🏫 {item.teacher}:</span>
                    <p>{item.reply}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Ask Form */}
            <form onSubmit={handleAskTeacher} className="consultation-form">
              <div className="consultation-teacher-select">
                <label>Select Faculty Member:</label>
                <select
                  value={selectedFacultyId}
                  onChange={(e) => setSelectedFacultyId(e.target.value)}
                  className="faculty-select"
                >
                  {FACULTY_MEMBERS.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — {f.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="consultation-input-row">
                <input
                  type="text"
                  placeholder="Ask a question about the curriculum, proofs, bots, or risk..."
                  value={teacherQuery}
                  onChange={(e) => setTeacherQuery(e.target.value)}
                  className="consultation-text-input"
                />
                <button
                  type="submit"
                  disabled={!teacherQuery.trim() || isConsulting}
                  className="btn-send-consultation"
                >
                  <Send size={16} />
                  <span>{isConsulting ? 'Consulting...' : 'Ask Instructor'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. Interactive Quiz Modal */}
      {isQuizOpen && quizModule && (
        <div className="modal-backdrop" onClick={() => setIsQuizOpen(false)}>
          <div className="quiz-modal" onClick={(e) => e.stopPropagation()}>
            <div className="quiz-modal-header">
              <div className="flex items-center gap-2">
                <GraduationCap size={22} className="text-cyan-400" />
                <div>
                  <h3 className="quiz-title">{quizModule.quiz.title}</h3>
                  <span className="text-xs text-muted">
                    Instructor: {quizModule.instructor} • Passing criteria: {quizModule.quiz.passingScore}%
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
                        Submit Examination
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Result Score View */
                <div className="quiz-result-view">
                  <div
                    className={`quiz-score-circle ${quizScore >= quizModule.quiz.passingScore ? 'passed' : 'failed'}`}
                  >
                    <span className="score-val">{quizScore}%</span>
                    <span className="score-label">
                      {quizScore >= quizModule.quiz.passingScore ? 'CERTIFIED' : 'RETRY'}
                    </span>
                  </div>

                  <h3 className="result-headline">
                    {quizScore >= quizModule.quiz.passingScore
                      ? '🎉 Outstanding! Course Certification Achieved!'
                      : 'Keep Practicing! Review the Lessons and Reattempt.'}
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
                            <span
                              className={`exp-status ${isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}
                            >
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
                      Done & Return to Curriculum
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
