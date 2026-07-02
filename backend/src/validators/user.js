import { body, param, validationResult } from 'express-validator';

export const validateCreateUser = [
  body('fullName')
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Full name must be between 20 and 60 characters'),
  
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  
  body('password')
    .isLength({ min: 8, max: 16 })
    .withMessage('Password must be between 8 and 16 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character'),
  
  body('address')
    .optional()
    .trim()
    .isLength({ max: 400 })
    .withMessage('Address must not exceed 400 characters'),
  
  body('role')
    .optional()
    .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
    .withMessage('Invalid role specified'),
];

export const validateUpdateUser = [
  param('id')
    .isUUID()
    .withMessage('Invalid user ID'),
  
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 20, max: 60 })
    .withMessage('Full name must be between 20 and 60 characters'),
  
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
  
  body('role')
    .optional()
    .isIn(['ADMIN', 'USER', 'STORE_OWNER'])
    .withMessage('Invalid role specified'),
];

export const validateUserId = [
  param('id')
    .isUUID()
    .withMessage('Invalid user ID'),
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
