const express = require('express');
const { authMiddleware, requiredRole } = require('../middlewares/authMiddleware');
const User = require('../models/User');
const router = express.Router();
const { pendingDealsController, moderateDealsController, userListController, userRoleController } = require('../controllers/adminController')

router.patch("/deals/:id/moderate", authMiddleware, requiredRole(User.ROLES.MODERATOR), moderateDealsController);
router.get("/deals/pending", authMiddleware, requiredRole(User.ROLES.MODERATOR), pendingDealsController);
router.get("/users", authMiddleware, requiredRole(User.ROLES.ADMIN), userListController);
router.patch("/users/:id/role", authMiddleware, requiredRole(User.ROLES.ADMIN), userRoleController);

module.exports = router;