const express = require('express');
const { validate } = require('../middlewares/validatorMiddleware');
const { registerValidator, loginValidator } = require('../validators/authValidator')
const { registerController, loginController, profileController } = require('../controllers/authController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const router = express.Router();

router.post("/register", registerValidator, validate, registerController);
router.post("/login", loginValidator, validate, loginController);
router.get("/me", authMiddleware, profileController);

module.exports = router;