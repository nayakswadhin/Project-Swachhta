import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    role: {
      type: String,
      enum: ['USER', 'DIVISIONAL_OFFICE'],
      required: true
    }
  },
  recipient: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    role: {
      type: String,
      enum: ['USER', 'DIVISIONAL_OFFICE'],
      required: true
    }
  },
  content: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['ANNOUNCEMENT', 'DIRECT'],
    default: 'DIRECT'
  },
  importance: {
    type: String,
    enum: ['INFO', 'SUCCESS', 'WARNING', 'URGENT', 'CRITICAL'],
    default: 'INFO',
    required: true
  }
}, {
  timestamps: true
});

export const Message = mongoose.model("Message", messageSchema);