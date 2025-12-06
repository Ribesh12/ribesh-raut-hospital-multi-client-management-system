import express from 'express';
import {
  createDoctor,
  getDoctorsByHospital,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
} from '../controllers/doctor.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createDoctor);
router.get('/hospital/:hospitalId', getDoctorsByHospital);
router.get('/:doctorId', getDoctorById);
router.put('/:doctorId', authenticate, updateDoctor);
router.delete('/:doctorId', authenticate, deleteDoctor);

export default router;
