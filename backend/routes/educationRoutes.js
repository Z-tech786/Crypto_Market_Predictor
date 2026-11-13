import express from 'express';
import { Module } from '../models/Module.js';
import { SEED_MODULES } from '../utils/seedData.js';

const router = express.Router();

// Get all modules & lessons
router.get('/modules', async (req, res) => {
  try {
    let modules = await Module.find();
    if (!modules || modules.length === 0) {
      modules = SEED_MODULES;
    }
    return res.json({ success: true, count: modules.length, data: modules });
  } catch (err) {
    return res.json({ success: true, count: SEED_MODULES.length, data: SEED_MODULES });
  }
});

// Add a new lesson
router.post('/lessons', async (req, res) => {
  try {
    const { moduleId, title, content, keyTakeaway } = req.body;
    if (!moduleId || !title || !content) {
      return res.status(400).json({ success: false, message: 'Please provide moduleId, title, and content.' });
    }

    const newLesson = {
      id: `lesson-${Date.now()}`,
      title,
      content,
      keyTakeaway: keyTakeaway || 'Academic curriculum insight.'
    };

    let mod = await Module.findOne({ moduleId });
    if (mod) {
      mod.lessons.push(newLesson);
      await mod.save();
    }

    return res.status(201).json({
      success: true,
      message: 'Lesson added successfully.',
      data: newLesson
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// Submit Quiz
router.post('/quiz/:id/submit', async (req, res) => {
  try {
    const quizId = req.params.id;
    const { answers } = req.body; // e.g. { 0: 1, 1: 1, 2: 1 }

    let targetModule = await Module.findOne({ 'quiz.id': quizId });
    if (!targetModule) {
      targetModule = SEED_MODULES.find(m => m.quiz.id === quizId) || SEED_MODULES[0];
    }

    const quiz = targetModule.quiz;
    let correctCount = 0;
    const explanations = [];

    quiz.questions.forEach((q, idx) => {
      const isCorrect = answers && answers[idx] === q.correctIndex;
      if (isCorrect) correctCount++;
      explanations.push({
        questionId: q.id,
        isCorrect,
        correctIndex: q.correctIndex,
        explanation: q.explanation
      });
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    return res.json({
      success: true,
      data: {
        quizId,
        score,
        passed,
        passingScore: quiz.passingScore,
        correctCount,
        totalQuestions: quiz.questions.length,
        explanations
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
