const errorHandler = (err, req, res, next) => {
  console.error(`❌ Erreur : ${err.message}`);

  // Erreur de validation Mongoose
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }

  // Duplicate key (email unique)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({ success: false, message: `${field} déjà utilisé` });
  }

  // Cast error (ID invalide)
  if (err.name === 'CastError') {
    return res.status(400).json({ success: false, message: 'ID invalide' });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
  });
};

module.exports = errorHandler;
