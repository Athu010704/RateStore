import express from 'express';
import {
  getAdminDashboard,
  getStoreOwnerDashboard,
  getUserDashboard
} from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/admin', authenticate, authorize('ADMIN'), getAdminDashboard);
router.get('/store-owner', authenticate, authorize('STORE_OWNER'), getStoreOwnerDashboard);
router.get('/user', authenticate, authorize('USER'), getUserDashboard);

export default router;
