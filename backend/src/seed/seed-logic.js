const Product = require('../models/Product');
const User = require('../models/User');
const StockMovement = require('../models/StockMovement');
const PurchaseList = require('../models/PurchaseList');

const seedLogic = async () => {
    // Nettoyage COMPLET
    await Product.deleteMany({});
    await User.deleteMany({});
    await StockMovement.deleteMany({});
    await PurchaseList.deleteMany({});
    console.log('🗑️  Base de données nettoyée');

    // On recrée uniquement l'équipe (8 membres)
    const userData = [
      { name: 'Sammy', email: 'sammy@tala.com', role: 'admin', password: 'password123', phone: '0777031583' },
      { name: 'Mohand', email: 'mohand@tala.com', role: 'admin', password: 'password123', phone: '+33760102486' },
      { name: 'Kahina', email: 'kahina@tala.com', role: 'admin', password: 'password123', phone: '+3360250893' },
      { name: 'Amel', email: 'amel@tala.com', role: 'employee', password: 'password123', phone: '0782085610' },
      { name: 'Maher', email: 'maher@tala.com', role: 'employee', password: 'password123', phone: '0542270782' },
      { name: 'Mejda', email: 'mejda@tala.com', role: 'employee', password: 'password123', phone: '0555583079' },
      { name: 'Melissa', email: 'melissa@tala.com', role: 'employee', password: 'password123', phone: '0556332178' },
      { name: 'Ryad', email: 'ryad@tala.com', role: 'employee', password: 'password123', phone: '0791552040' },
    ];
    
    await Promise.all(userData.map(user => User.create(user)));
    console.log(`👤 Équipe de ${userData.length} membres restaurée (Mdp par défaut: password123)`);
    console.log('✅ L\'application est maintenant neuve et vide.');
};

module.exports = seedLogic;
