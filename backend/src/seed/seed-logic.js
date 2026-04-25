const Product = require('../models/Product');
const User = require('../models/User');
const StockMovement = require('../models/StockMovement');
const PurchaseList = require('../models/PurchaseList');

const seedLogic = async () => {
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
    
    const users = await Promise.all(userData.map(user => User.create(user)));
    console.log(`👤 ${users.length} utilisateurs créés`);

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

    // Mouvements
    const today = new Date();
    await StockMovement.insertMany([
      { product: products[0]._id, type: 'entry', quantity: 5, note: 'Initial', date: today },
      { product: products[1]._id, type: 'entry', quantity: 20, note: 'Initial', date: today },
    ]);

    // Historique Stats
    const monthAgo = new Date(today); monthAgo.setMonth(monthAgo.getMonth() - 1);
    await PurchaseList.insertMany([
      { items: [{ productName: 'Café Arabica', quantity: 10, unit: 'kg', price: 3500 }], totalAmount: 35000, status: 'whatsapp_sent', createdAt: monthAgo },
      { items: [{ productName: 'Lait entier', quantity: 5, unit: 'litre', price: 120 }], totalAmount: 600, status: 'whatsapp_sent', createdAt: today }
    ]);
};

module.exports = seedLogic;
