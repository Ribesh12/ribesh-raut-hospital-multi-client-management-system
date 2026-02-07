import express from 'express';
import {
  getSuperAdminStats,
  getAllHospitals,
  getHospitalDetails,
  getAllAppointments,
  getAllDoctors,
  getAllContactForms,
  deleteHospital,
  getPlatformSummary,
  submitWebsiteContactForm,
  getWebsiteContactForms,
  updateWebsiteContactFormStatus,
  deleteWebsiteContactForm,
} from '../controllers/superAdmin.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All routes require authentication and are restricted to website_admin (super admin)

// Dashboard statistics
router.get('/stats', authenticate, getSuperAdminStats);

// Platform summary
router.get('/summary', authenticate, getPlatformSummary);

// Hospital management
router.get('/hospitals', authenticate, getAllHospitals);
router.get('/hospitals/:hospitalId', authenticate, getHospitalDetails);
router.delete('/hospitals/:hospitalId', authenticate, deleteHospital);

// All appointments
router.get('/appointments', authenticate, getAllAppointments);

// All doctors
router.get('/doctors', authenticate, getAllDoctors);

// All contact forms (hospital contact forms)
router.get('/contact-forms', authenticate, getAllContactForms);

// Website contact forms (landing page)
router.post('/website-contact-forms', submitWebsiteContactForm); // Public endpoint
router.get('/website-contact-forms', authenticate, getWebsiteContactForms);
router.put('/website-contact-forms/:formId', authenticate, updateWebsiteContactFormStatus);
router.delete('/website-contact-forms/:formId', authenticate, deleteWebsiteContactForm);

export default router;
