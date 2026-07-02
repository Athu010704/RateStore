import { body, param, validationResult } from 'express-validator';

export const validateCreateStore = [
  body('storeName')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Store name must be between 3 and 100 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('address')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  
  body('ownerId')
    .isUUID()
    .withMessage('Invalid owner ID'),
];

export const validateUpdateStore = [
  param('id')
    .isUUID()
    .withMessage('Invalid store ID'),
  
  body('storeName')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Store name must be between 3 and 100 characters'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  
  body('ownerId')
    .optional()
    .isUUID()
    .withMessage('Invalid owner ID'),
];

export const validateStoreId = [
  param('id')
    .isUUID()
    .withMessage('Invalid store ID'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  next();
};
