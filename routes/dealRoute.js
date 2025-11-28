const express = require('express');
const router = express.Router();
const { dealController, createDealController, updateDealController, dealSearchController, searchByIdController, deleteDealController } = require('../controllers/dealController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { ownershipMiddleware } = require('../middlewares/ownershipMiddleware');
const Deal = require('../models/Deal')

router.get('/search', dealSearchController)
router.get('/:id', searchByIdController)
router.get('/', dealController);
router.post('/', authMiddleware, createDealController);
router.put('/:id', authMiddleware, ownershipMiddleware(Deal), updateDealController);
router.delete('/:id', authMiddleware, ownershipMiddleware(Deal), deleteDealController)

module.exports = router;