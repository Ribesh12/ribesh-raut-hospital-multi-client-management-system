import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    specialty: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    hospitalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Hospital',
      required: true,
    },
    photo: {
      type: String,
      default: '',
    },
    qualifications: {
      type: String,
      default: '',
    },
    experience: {
      type: Number,
      default: 0,
      description: 'Years of experience',
    },
    bio: {
      type: String,
      default: '',
    },
    consultationFee: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['Active', 'On Leave', 'Inactive'],
      default: 'Active',
    },
    workingDays: {
      type: [String],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    },
    workingHours: {
      start: {
        type: String,
        default: '09:00',
      },
      end: {
        type: String,
        default: '17:00',
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
