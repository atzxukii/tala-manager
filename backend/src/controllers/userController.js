const User = require('../models/User');

// GET /api/users
const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ role: 1, name: 1 });
    res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

// POST /api/users
const createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// PUT /api/users/:id
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/users/:id
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'Utilisateur introuvable' });
    res.json({ success: true, message: 'Utilisateur supprimé' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
