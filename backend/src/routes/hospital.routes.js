import express from 'express';
import {
  getHospitalById,
  getHospitalProfile,
  updateHospital,
  getAllHospitals,
  getHospitalStats,
  uploadHospitalProfilePicture as uploadProfilePictureController,
  uploadHospitalImages as uploadImagesController,
  deleteHospitalImage,
  getHospitalBySlug,
} from '../controllers/hospital.controller.js';
import { authenticate, authorizeHospitalAdmin } from '../middlewares/auth.middleware.js';
import { 
  uploadHospitalProfilePicture, 
  uploadHospitalImages, 
  handleUploadError 
} from '../middlewares/upload.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllHospitals);
router.get('/public/:slug', getHospitalBySlug);
router.get('/:id', getHospitalById);

// Protected routes (require authentication)
router.get('/profile/view', authenticate, authorizeHospitalAdmin, getHospitalProfile);
router.get('/stats/view', authenticate, authorizeHospitalAdmin, getHospitalStats);

// Update hospital (can be called by the hospital itself or admins)
router.put('/:id', authenticate, updateHospital);

// Image upload routes
router.post('/:id/profile-picture', authenticate, uploadHospitalProfilePicture, handleUploadError, uploadProfilePictureController);
router.post('/:id/images', authenticate, uploadHospitalImages, handleUploadError, uploadImagesController);
router.delete('/:id/images', authenticate, deleteHospitalImage);

export default router;
