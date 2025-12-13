import Joi from 'joi';

export const createAppointmentSchema = Joi.object({
  doctorId: Joi.string().required().messages({
    'string.empty': 'Doctor ID is required',
    'any.required': 'Doctor ID is required',
  }),
  hospitalId: Joi.string().required().messages({
    'string.empty': 'Hospital ID is required',
    'any.required': 'Hospital ID is required',
  }),
  appointmentDate: Joi.date().iso().required().messages({
    'date.base': 'Appointment date must be a valid ISO date',
    'any.required': 'Appointment date is required',
  }),
  duration: Joi.number().valid(30, 45, 60).required().messages({
    'any.only': 'Duration must be 30, 45, or 60 minutes',
    'any.required': 'Duration is required',
  }),
  userName: Joi.string().min(2).max(100).required().messages({
    'string.empty': 'User name is required',
    'string.min': 'User name must be at least 2 characters',
    'any.required': 'User name is required',
  }),
  userEmail: Joi.string().email().required().messages({
    'string.email': 'User email must be a valid email',
    'any.required': 'User email is required',
  }),
  userPhone: Joi.string().min(10).required().messages({
    'string.empty': 'User phone is required',
    'string.min': 'User phone must be at least 10 characters',
    'any.required': 'User phone is required',
  }),
  userId: Joi.string().optional(),
  notes: Joi.string().max(500).optional().messages({
    'string.max': 'Notes cannot exceed 500 characters',
  }),
});

export const updateAppointmentStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'cancelled', 'completed')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, confirmed, cancelled, completed',
      'any.required': 'Status is required',
    }),
  adminNotes: Joi.string().max(500).optional().messages({
    'string.max': 'Admin notes cannot exceed 500 characters',
  }),
});

export const cancelAppointmentSchema = Joi.object({
  reason: Joi.string().max(500).optional().messages({
    'string.max': 'Reason cannot exceed 500 characters',
  }),
});
