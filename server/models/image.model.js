import mongoose from 'mongoose';

const postOfficeImageSchema = new mongoose.Schema({
  postOfficeId: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  Area: {
    type: String,
    default: 'Lawns'
  }
});

// Index for faster queries
postOfficeImageSchema.index({ postOfficeId: 1, createdAt: -1 });

const PostOfficeImage = mongoose.model('PostOfficeImage', postOfficeImageSchema);

export default PostOfficeImage;