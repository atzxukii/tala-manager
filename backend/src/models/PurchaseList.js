const mongoose = require('mongoose');

const purchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
  },
  productName: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1 },
  unit: { type: String, required: true },
  price: { type: Number, default: 0 },
});

const purchaseListSchema = new mongoose.Schema(
  {
    items: [purchaseItemSchema],
    sentTo: {
      type: String,
      trim: true,
      default: null,
    },
    sentToName: {
      type: String,
      trim: true,
      default: null,
    },
    sentAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['draft', 'sent', 'whatsapp_sent'],
      default: 'draft',
    },
    sentToPhone: {
      type: String,
      trim: true,
      default: null,
    },
    emailBody: {
      type: String,
      default: '',
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PurchaseList', purchaseListSchema);
