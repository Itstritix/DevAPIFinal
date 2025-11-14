const { AppError } = require("../utils/error");
const User = require("../models/User");
const { generateToken } = require("../middlewares/authMiddleware");

const registerController = async (req, res, next) => {
  const { username, email, password } = req.body;

  // check if user already exists (pseudo or email)
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });

  if (existingUser) {
    return next(new AppError("Utilisateur déjà existant", 409));
  }

  const user = new User({
    username,
    email,
    password,
  });
  await user.save();

  const jwtToken = generateToken(user._id);

  res.status(201).json({
    message: "Utilisateur enregistré avec succès",
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
    token: jwtToken,
  });
};

const loginController = async (req, res, next) => {
    const { email, password } = req.body
    const existingUser = await User.findOne({email});

    if (!existingUser) {
        return next(new AppError("L'utilisateur n'existe pas", 401));
    }

    const passwordMatch = await existingUser.comparePassword(password);

    if (!passwordMatch) {
        return next(new AppError("L'utilisateur n'existe pas", 401));
    }

    const jwtToken = generateToken(existingUser._id);
    return res.status(200).json({
            message: "Login successful",
            user: existingUser,
            token: jwtToken
        });
}

const profileController = async (req, res, next) => {
    const user = req.user;

    res.status(200).json({
        ID: user.id,
        Email: user.email,
        Username: user.username,
        CreatedAt: user.createdAt,
        UpdatedAt: user.updatedAt
    });
}

module.exports = { registerController, loginController, profileController };