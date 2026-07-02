import { body, param, validationResult } from 'express-validator';

export const validateCreateRating = [
  body('userId')
    .isUUID()
    .withMessage('Invalid user ID'),
  
  body('storeId')
    .isUUID()
    .withMessage('Invalid store ID'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
];

export const validateUpdateRating = [
  param('id')
    .isUUID()
    .withMessage('Invalid rating ID'),
  
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be an integer between 1 and 5'),
];

export const validateRatingId = [
  param('id')
    .isUUID()
    .withMessage('Invalid rating ID'),
];

export const validateStoreIdParam = [
  param('storeId')
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
