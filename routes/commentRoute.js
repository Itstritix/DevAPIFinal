const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');
const { commentController, createCommentController, updateCommentController, deleteCommentController } = require('../controllers/commentController');
const { validate } = require('../middlewares/validatorMiddleware');
const { ownershipMiddleware } = require('../middlewares/ownershipMiddleware');
const { commentValidator } = require('../validators/commentValidator');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get('/:dealId/comments', commentController);
router.post('/:dealId/comments', authMiddleware, commentValidator, validate, createCommentController);
router.put('/:id', authMiddleware, ownershipMiddleware(Comment), commentValidator, validate, updateCommentController);
router.delete('/:id', authMiddleware, ownershipMiddleware(Comment), deleteCommentController);

module.exports = router;