const { body } = require('express-validator');

const commentValidator = [
    body('content')
        .notEmpty().withMessage('Content is required and must be between 3 and 500 characters.')
        .isLength({ min: 3, max: 500}).withMessage('Content must be between 3 and 500 characters.')
];

module.exports = { commentValidator };