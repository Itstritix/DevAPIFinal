const { body } = require('express-validator');

const registerValidator = [
    body('username')
        .notEmpty().withMessage("Username is required")
        .isLength({ min: 3 }).withMessage("Length of the username should be atleast 3 letters"),
    body('email')
        .notEmpty().withMessage("Email can't be empty")
        .isEmail().withMessage("Email should be valid"),
    body('password')
        .notEmpty().withMessage("Password is required")
        .isLength({ min: 8 }).withMessage("Password length should be atleast 8"),
    body('bio')
        .optional()
        .isLength({ max: 200 }).withMessage("Bio shouldn't contains more than 200 characters")
];

const loginValidator = [
    body('email')
        .notEmpty().withMessage("Email is required")
        .isEmail().withMessage("Email should be valid"),
    body('password')
        .notEmpty().withMessage("Password is required")
];

module.exports = { registerValidator, loginValidator };