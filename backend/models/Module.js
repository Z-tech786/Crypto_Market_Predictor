import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
  moduleId: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
  readTime: { type: String, default: '15 min' },
  description: { type: String, default: '' },
  lessons: [{
    id: String,
    title: String,
    content: String,
    keyTakeaway: String
  }],
  quiz: {
    id: String,
    title: String,
    passingScore: { type: Number, default: 70 },
    questions: [{
      id: String,
      question: String,
      options: [String],
      correctIndex: Number,
      explanation: String
    }]
  }
}, {
  timestamps: true
});

export const Module = mongoose.model('Module', moduleSchema);
