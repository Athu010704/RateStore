import express from 'express';
import {
  getStores,
  getStoreById,
  createStore,
  updateStore,
  deleteStore
} from '../controllers/storeController.js';
import {
  validateCreateStore,
  validateUpdateStore,
  validateStoreId,
  handleValidationErrors
} from '../validators/store.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getStores);
router.get('/:id', authenticate, validateStoreId, handleValidationErrors, getStoreById);
router.post('/', authenticate, authorize('ADMIN', 'STORE_OWNER'), validateCreateStore, handleValidationErrors, createStore);
router.put('/:id', authenticate, authorize('ADMIN', 'STORE_OWNER'), validateUpdateStore, handleValidationErrors, updateStore);
router.delete('/:id', authenticate, authorize('ADMIN'), validateStoreId, handleValidationErrors, deleteStore);

export default router;
