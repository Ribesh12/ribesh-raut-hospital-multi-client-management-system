import express from 'express';
import {
  createSchedule,
  getSchedulesByHospital,
  getScheduleById,
  getScheduleByDoctor,
  updateSchedule,
  deleteSchedule,
  getPublicSchedulesByHospital,
} from '../controllers/schedule.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes (no auth required)
router.get('/public/hospital/:hospitalId', getPublicSchedulesByHospital);

// Protected routes
router.post('/', authenticate, createSchedule);
router.get('/hospital/:hospitalId', authenticate, getSchedulesByHospital);
router.get('/doctor/:doctorId', authenticate, getScheduleByDoctor);
router.get('/:scheduleId', authenticate, getScheduleById);
router.put('/:scheduleId', authenticate, updateSchedule);
router.delete('/:scheduleId', authenticate, deleteSchedule);

export default router;
