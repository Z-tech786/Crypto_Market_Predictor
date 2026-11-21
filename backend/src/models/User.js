import mongoose from 'mongoose';


    studentId: { type: String, required: true, unique: true, trim: true, maxlength: 40 },
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'trader', 'admin'], default: 'student' },
    riskTolerance: {
      type: String,
      enum: ['Conservative', 'Moderate', 'Aggressive'],
      default: 'Moderate'
    },
    watchlist: { type: [String], default: ['bitcoin', 'ethereum', 'solana'] }
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
