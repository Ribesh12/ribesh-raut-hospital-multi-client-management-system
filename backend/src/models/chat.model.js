import mongoose from 'mongoose';

const chatSchema = new mongoose.Schema(
  {
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
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
      },
    ],
    context: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

chatSchema.index({ hospitalId: 1, userId: 1 });

export default mongoose.model('Chat', chatSchema);
