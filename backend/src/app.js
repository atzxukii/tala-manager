require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Routes
const productRoutes = require('./routes/products');
const stockRoutes = require('./routes/stock');
const historyRoutes = require('./routes/history');
const purchaseRoutes = require('./routes/purchases');
const emailRoutes = require('./routes/email');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chat');
const whatsappRoutes = require('./routes/whatsapp');

// Connexion BDD
connectDB();

const app = express();

// Middleware globaux
app.use(cors()); // Autorise toutes les origines pour le test réseau
app.use(express.json());
app.use(morgan('dev'));

// Routes API
app.use('/api/products', productRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/purchases', purchaseRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/whatsapp', whatsappRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '☕ Coffee Shop API is running', timestamp: new Date() });
});

// Route secrète pour le seed (à supprimer après usage)
app.get('/api/seed-database-secret-123', async (req, res, next) => {
  try {
    const seedLogic = require('./seed/seed-logic'); // On va isoler la logique
    await seedLogic();
    res.json({ success: true, message: '🌱 Base de données remplie avec succès !' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Route 404
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} introuvable` });
});

// Gestionnaire d'erreurs centralisé
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n☕ Coffee Shop Backend démarré`);
  console.log(`🚀 Serveur sur http://0.0.0.0:${PORT}`);
  console.log(`🔗 Health check : http://localhost:${PORT}/api/health\n`);
});

module.exports = app;
