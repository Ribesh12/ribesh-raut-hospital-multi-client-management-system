import express from 'express';
import {
  submitContactForm,
  getContactFormsByHospital,
  getContactFormById,
  updateContactFormStatus,
  deleteContactForm,
} from '../controllers/contactForm.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', submitContactForm);
router.get('/hospital/:hospitalId', authenticate, getContactFormsByHospital);
router.get('/:formId', authenticate, getContactFormById);
router.put('/:formId', authenticate, updateContactFormStatus);
router.delete('/:formId', authenticate, deleteContactForm);

export default router;
