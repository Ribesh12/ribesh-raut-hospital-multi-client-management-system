import express from 'express';
import {
  createDoctor,
  getDoctorsByHospital,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
  uploadDoctorPhotoController,
  getSpecialties,
} from '../controllers/doctor.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';
import { uploadDoctorPhoto, handleUploadError } from '../middlewares/upload.middleware.js';

const router = express.Router();

router.post('/', authenticate, createDoctor);
router.get('/hospital/:hospitalId', authenticate, getDoctorsByHospital);
router.get('/specialties/:hospitalId', authenticate, getSpecialties);
router.get('/:doctorId', authenticate, getDoctorById);
router.put('/:doctorId', authenticate, updateDoctor);
router.delete('/:doctorId', authenticate, deleteDoctor);

// Photo upload route
router.post('/:doctorId/photo', authenticate, uploadDoctorPhoto, handleUploadError, uploadDoctorPhotoController);

export default router;
