import express from 'express';
import {
  createAppointmentRequest,
  getAppointmentsByDoctor,
  getAppointmentsByUser,
  getAppointmentsByHospital,
  updateAppointmentStatus,
  cancelAppointment,
  getAvailableSlots,
  getAppointmentById,
} from '../controllers/appointment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.post('/request', createAppointmentRequest);
router.get('/available-slots', getAvailableSlots);

// Protected routes
router.get('/by-user/:userId', authenticate, getAppointmentsByUser);
router.get('/by-doctor/:doctorId', authenticate, getAppointmentsByDoctor);
router.get('/by-hospital/:hospitalId', authenticate, getAppointmentsByHospital);
router.get('/:appointmentId', authenticate, getAppointmentById);

// Admin routes
router.put('/:appointmentId/status', authenticate, updateAppointmentStatus);
router.put('/:appointmentId/cancel', authenticate, cancelAppointment);

export default router;
