import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'admin'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  readByAdmin: {
    type: Boolean,
    default: false,
  },
  readByUser: {
    type: Boolean,
    default: true,
  },
});

const chatSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    sessionId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      default: 'Guest',
    },
    userEmail: {
      type: String,
      default: '',
    },
    chatType: {
      type: String,
      enum: ['ai', 'human'],
      default: 'ai',
    },
    status: {
      type: String,
      enum: ['active', 'waiting', 'closed'],
      default: 'active',
    },
    messages: [messageSchema],
    context: {
      type: String,
      default: '',
    },
    lastActivity: {
      type: Date,
      default: Date.now,
    },
    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      default: null,
    },
  },
  { timestamps: true }
);

chatSchema.index({ hospitalId: 1, sessionId: 1 });
chatSchema.index({ hospitalId: 1, status: 1 });
chatSchema.index({ hospitalId: 1, chatType: 1, status: 1 });

export default mongoose.model('Chat', chatSchema);
