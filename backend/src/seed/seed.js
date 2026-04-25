require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const StockMovement = require('../models/StockMovement');
const PurchaseList = require('../models/PurchaseList');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connecté à MongoDB — démarrage du seed...');

    // Nettoyage
    await Product.deleteMany({});
    await User.deleteMany({});
    await StockMovement.deleteMany({});
    await PurchaseList.deleteMany({});
    console.log('🗑️  Collections nettoyées');

    // Utilisateurs
    const userData = [
      { name: 'Sammy', email: 'sammy@tala.com', role: 'admin', password: 'password123', phone: '0777031583' },
      { name: 'Mohand', email: 'mohand@tala.com', role: 'admin', password: 'password123', phone: '+33760102486' },
      { name: 'Kahina', email: 'kahina@tala.com', role: 'admin', password: 'password123', phone: '+3360250893' },
      { name: 'Amel', email: 'amel@tala.com', role: 'employee', password: 'password123', phone: '0782085610' },
      { name: 'Maher', email: 'maher@tala.com', role: 'employee', password: 'password123', phone: '0542270782' },
      { name: 'Mejda', email: 'mejda@tala.com', role: 'employee', password: 'password123', phone: '0555583079' },
      { name: 'Melissa', email: 'melissa@tala.com', role: 'employee', password: 'password123', phone: '0556332178' },
      { name: 'Riyad', email: 'riyad@tala.com', role: 'employee', password: 'password123', phone: '0791552040' },
    ];

    // On utilise Promise.all avec create() pour déclencher le hook pre-save de hachage
    const users = await Promise.all(userData.map(user => User.create(user)));
    console.log(`👤 ${users.length} utilisateurs créés (Mdp: password123)`);

    // Produits
    const products = await Product.insertMany([
      { name: 'Café Arabica', category: 'Café', quantity: 2, minThreshold: 5, unit: 'kg', price: 3500 },
      { name: 'Lait entier', category: 'Lait', quantity: 0, minThreshold: 10, unit: 'litre', price: 120 },
      { name: 'Lait d\'avoine', category: 'Lait', quantity: 3, minThreshold: 8, unit: 'litre', price: 450 },
      { name: 'Sucre blanc', category: 'Sucre', quantity: 8, minThreshold: 5, unit: 'kg', price: 95 },
      { name: 'Sucre roux', category: 'Sucre', quantity: 1, minThreshold: 3, unit: 'kg', price: 250 },
      { name: 'Pain de mie', category: 'Pain', quantity: 12, minThreshold: 10, unit: 'paquet', price: 180 },
      { name: 'Croissants surgelés', category: 'Viennoiserie', quantity: 4, minThreshold: 20, unit: 'pièce', price: 40 },
      { name: 'Chocolat en poudre', category: 'Café', quantity: 2, minThreshold: 3, unit: 'kg', price: 1200 },
      { name: 'Thé Earl Grey', category: 'Thé', quantity: 5, minThreshold: 5, unit: 'boîte', price: 850 },
      { name: 'Eau minérale', category: 'Boisson', quantity: 24, minThreshold: 12, unit: 'bouteille', price: 40 },
      { name: 'Serviettes en papier', category: 'Consommable', quantity: 2, minThreshold: 10, unit: 'paquet', price: 300 },
      { name: 'Gobelets 25cl', category: 'Consommable', quantity: 50, minThreshold: 100, unit: 'pièce', price: 15 },
    ]);
    console.log(`📦 ${products.length} produits créés`);

    // Quelques mouvements de stock historiques
    const movements = [];
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    movements.push(
      { product: products[0]._id, type: 'entry', quantity: 5, note: 'Livraison fournisseur', date: twoDaysAgo },
      { product: products[1]._id, type: 'entry', quantity: 20, note: 'Livraison matinale', date: twoDaysAgo },
      { product: products[1]._id, type: 'exit', quantity: 20, note: 'Consommation journalière', date: yesterday },
      { product: products[2]._id, type: 'entry', quantity: 10, note: 'Livraison', date: yesterday },
      { product: products[2]._id, type: 'exit', quantity: 7, note: 'Usage bar', date: today },
      { product: products[6]._id, type: 'entry', quantity: 30, note: 'Commande hebdo', date: twoDaysAgo },
      { product: products[6]._id, type: 'exit', quantity: 26, note: 'Ventes', date: yesterday },
    );

    await StockMovement.insertMany(movements);
    console.log(`📋 ${movements.length} mouvements de stock créés`);

    // Listes d'achat historiques pour les stats
    const monthAgo = new Date(today);
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    const historicalLists = [
      {
        items: [{ productName: 'Café Arabica', quantity: 10, unit: 'kg', price: 3500 }],
        totalAmount: 35000,
        status: 'whatsapp_sent',
        createdAt: monthAgo
      },
      {
        items: [{ productName: 'Lait entier', quantity: 20, unit: 'litre', price: 120 }],
        totalAmount: 2400,
        status: 'whatsapp_sent',
        createdAt: lastWeek
      },
      {
        items: [
          { productName: 'Sucre blanc', quantity: 5, unit: 'kg', price: 95 },
          { productName: 'Eau minérale', quantity: 12, unit: 'bouteille', price: 40 }
        ],
        totalAmount: 955,
        status: 'whatsapp_sent',
        createdAt: yesterday
      },
      {
        items: [{ productName: 'Café Arabica', quantity: 5, unit: 'kg', price: 3500 }],
        totalAmount: 17500,
        status: 'whatsapp_sent',
        createdAt: today
      }
    ];

    await PurchaseList.insertMany(historicalLists);
    console.log(`📈 ${historicalLists.length} listes d'achat historiques créées pour les stats`);

    console.log('\n🌱 Seed terminé avec succès !');
    console.log('📊 Résumé :');
    console.log(`   - Produits en alerte : ${products.filter(p => p.quantity < p.minThreshold).length}`);
    console.log(`   - Produits en rupture : ${products.filter(p => p.quantity === 0).length}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur seed :', err.message);
    process.exit(1);
  }
};

seed();
