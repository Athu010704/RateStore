import express from 'express';
import { 
  signup, 
  login, 
  logout, 
  refreshToken, 
  changePassword, 
  getMe 
} from '../controllers/authController.js';
import { 
  validateSignup, 
  validateLogin, 
  validateChangePassword, 
  handleValidationErrors 
} from '../validators/auth.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);
router.post('/logout', authenticate, logout);
router.post('/refresh-token', refreshToken);
router.put('/change-password', authenticate, validateChangePassword, handleValidationErrors, changePassword);
router.get('/me', authenticate, getMe);

export default router;
