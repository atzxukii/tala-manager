const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Générer JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'coffeeshop_secret_key', {
    expiresIn: '30d',
  });
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(401).json({ success: false, message: 'Email ou mot de passe incorrect' });
    }
  } catch (err) {
    next(err);
  }
};

// GET /api/auth/me — Obtenir le profil connecté (nécessite un middleware auth, plus tard)
const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, getMe };
