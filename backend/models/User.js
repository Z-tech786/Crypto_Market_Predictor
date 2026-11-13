import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  studentId: { type: String, default: '23L-0568' },
  role: { 
    type: String, 
    enum: ['student', 'trader', 'admin'], 
    default: 'student' 
  },
  riskTolerance: { 
    type: String, 
    enum: ['Conservative', 'Moderate', 'Aggressive'], 
    default: 'Moderate' 
  },
  balance: { type: Number, default: 10000.0 },
  status: { 
    type: String, 
    enum: ['Active', 'Suspended'], 
    default: 'Active' 
  },
  avatar: { type: String, default: '' },
  completedLessons: [{ type: String }],
  quizResults: { type: Map, of: Object, default: {} }
}, {
  timestamps: true
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model('User', userSchema);
