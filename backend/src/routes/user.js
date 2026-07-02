import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controllers/userController.js';
import {
  validateCreateUser,
  validateUpdateUser,
  validateUserId,
  handleValidationErrors
} from '../validators/user.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN'), getUsers);
router.get('/:id', authenticate, validateUserId, handleValidationErrors, getUserById);
router.post('/', authenticate, authorize('ADMIN'), validateCreateUser, handleValidationErrors, createUser);
router.put('/:id', authenticate, authorize('ADMIN'), validateUpdateUser, handleValidationErrors, updateUser);
router.delete('/:id', authenticate, authorize('ADMIN'), validateUserId, handleValidationErrors, deleteUser);

export default router;
