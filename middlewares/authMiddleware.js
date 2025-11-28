const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('../utils/error');
require('dotenv').config('../.env')

const JWT_SECRET = process.env.JWT_SECRET || 'votre_secret_jwt';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '8d';

// Générer un token JWT
const generateToken = (userId) => {
  return jwt.sign(
    { userId: userId }, 
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE } // Token valide 24h
  );
};

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError("AUthentication token is either missing or invalid", 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: "User doesn't exist" });
    }
    req.user = user;
    next();
  } catch (error) {
    next(new AppError("Authentication token is invalid", 401));
  }
};

module.exports = {
    generateToken,
    authMiddleware
};