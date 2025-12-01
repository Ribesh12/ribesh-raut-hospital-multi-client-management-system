import express from 'express';
import {
  login,
  logout,
  registerWebsiteAdmin,
  registerHospitalAdmin,
} from '../controllers/auth.controller.js';
import {
  authenticate,
  authorizeWebsiteAdmin,
} from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/login', login);
router.post('/logout', authenticate, logout);
router.post('/register/website-admin', registerWebsiteAdmin);
router.post('/register/hospital-admin', registerHospitalAdmin);

export default router;
