const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Le nom du produit est requis'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'La catégorie est requise'],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, 'La quantité est requise'],
      min: [0, 'La quantité ne peut pas être négative'],
      default: 0,
    },
    minThreshold: {
      type: Number,
      min: [0, 'Le seuil ne peut pas être négatif'],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, "L'unité est requise"],
      enum: ['kg', 'g', 'litre', 'ml', 'paquet', 'boîte', 'pièce', 'sachet', 'bouteille'],
      default: 'pièce',
    },
    price: {
      type: Number,
      min: [0, 'Le prix ne peut pas être négatif'],
      default: 0,
    },
  },
  { timestamps: true }
);

// Virtuel : statut du stock
productSchema.virtual('stockStatus').get(function () {
  if (this.quantity === 0) return 'out';
  if (this.quantity < this.minThreshold) return 'low';
  return 'ok';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Product', productSchema);
