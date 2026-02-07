import express from 'express';
import {
  createService,
  getServicesByHospital,
  getServiceById,
  updateService,
  deleteService,
  getServiceCategories,
} from '../controllers/service.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, createService);
router.get('/hospital/:hospitalId', authenticate, getServicesByHospital);
router.get('/categories/:hospitalId', authenticate, getServiceCategories);
router.get('/:serviceId', authenticate, getServiceById);
router.put('/:serviceId', authenticate, updateService);
router.delete('/:serviceId', authenticate, deleteService);

export default router;
