import mongoose from 'mongoose';

const greenScoreSchema = new mongoose.Schema({
  postOfficeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PostOffice',
    required: true
  },
  score: {
    type: String,
    enum: ['poor', 'good', 'excellent', 'average'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

export const GreenScore = mongoose.model('GreenScore', greenScoreSchema);