const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Le produit est requis'],
    },
    type: {
      type: String,
      enum: ['entry', 'exit'],
      required: [true, 'Le type (entry/exit) est requis'],
    },
    quantity: {
      type: Number,
      required: [true, 'La quantité est requise'],
      min: [1, 'La quantité doit être au minimum 1'],
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StockMovement', stockMovementSchema);
