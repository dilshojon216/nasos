const { body } = require('express-validator');
const Role = require('../../utils/userRoles.utils');

exports.createUserSchema = [
  body('username')
    .exists()
    .withMessage('username is required')
    .isLength({ min: 3 })
    .withMessage('Must be at least 3 chars long'),
  body('first_name')
    .exists()
    .withMessage('Your first name is required')
    .isAlpha()
    .withMessage('Must be only alphabetical chars')
    .isLength({ min: 3 })
    .withMessage('Must be at least 3 chars long'),
  body('role')
    .optional()
    .isIn([Role.Admin, Role.SuperUser])
    .withMessage('Invalid Role type'),
  body('password')
    .exists()
    .withMessage('Password is required')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage('Password must contain at least 6 characters')
    .isLength({ max: 10 })
    .withMessage('Password can contain max 10 characters'),
];

exports.updateUserSchema = [
    body('username')
        .optional()
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('first_name')
        .optional()
        .isAlpha()
        .withMessage('Must be only alphabetical chars')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('role')
        .optional()
        .isIn([Role.Admin, Role.SuperUser])
        .withMessage('Invalid Role type'),
    body('password')
        .optional()
        .notEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must contain at least 6 characters')
        .isLength({ max: 10 })
        .withMessage('Password can contain max 10 characters')
        .custom((value, { req }) => !!req.body.confirm_password)
        .withMessage('Please confirm your password'),
    body()
        .custom(value => {
            return !!Object.keys(value).length;
        })
        .withMessage('Please provide required field to update')
        .custom(value => {
            const updates = Object.keys(value);
            const allowUpdates = ['username', 'password', 'confirm_password', 'email', 'role', 'first_name', 'last_name', 'age'];
            return updates.every(update => allowUpdates.includes(update));
        })
        .withMessage('Invalid updates!')
];

exports.validateLogin = [
       body('username')
        .exists()
        .withMessage('username is required')
        .isLength({ min: 3 })
        .withMessage('Must be at least 3 chars long'),
    body('password')
        .exists()
        .withMessage('Password is required')
        .notEmpty()
        .withMessage('Password must be filled')
];