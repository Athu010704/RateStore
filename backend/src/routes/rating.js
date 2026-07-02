import express from 'express';
import {
  getRatings,
  getRatingById,
  getRatingsByStore,
  createRating,
  updateRating,
  deleteRating
} from '../controllers/ratingController.js';
import {
  validateCreateRating,
  validateUpdateRating,
  validateRatingId,
  validateStoreIdParam,
  handleValidationErrors
} from '../validators/rating.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN'), getRatings);
router.get('/:id', authenticate, validateRatingId, handleValidationErrors, getRatingById);
router.get('/store/:storeId', authenticate, validateStoreIdParam, handleValidationErrors, getRatingsByStore);
router.post('/', authenticate, validateCreateRating, handleValidationErrors, createRating);
router.put('/:id', authenticate, validateUpdateRating, handleValidationErrors, updateRating);
router.delete('/:id', authenticate, authorize('ADMIN', 'USER'), validateRatingId, handleValidationErrors, deleteRating);

export default router;
