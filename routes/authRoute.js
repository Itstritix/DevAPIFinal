const express = require('express');
const { validate } = require('../middlewares/validationMiddleware');
const { registerController, loginController, profileController } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/register", validate, registerController);
router.post("/login", validate, loginController);
router.get("/me", authMiddleware, profileController);

module.exports = router;