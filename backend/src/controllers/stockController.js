const Product = require('../models/Product');
const StockMovement = require('../models/StockMovement');

// POST /api/stock/entry — Ajouter du stock
const addStock = async (req, res, next) => {
  try {
    const { productId, quantity, note } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });

    product.quantity += Number(quantity);
    await product.save();

    const movement = await StockMovement.create({
      product: productId,
      type: 'entry',
      quantity: Number(quantity),
      note: note || '',
    });

    await movement.populate('product', 'name unit');
    res.status(201).json({ success: true, data: movement, updatedProduct: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/stock/exit — Retirer du stock
const removeStock = async (req, res, next) => {
  try {
    const { productId, quantity, note } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });

    if (product.quantity < Number(quantity)) {
      return res.status(400).json({
        success: false,
        message: `Stock insuffisant. Stock actuel : ${product.quantity} ${product.unit}`,
      });
    }

    product.quantity -= Number(quantity);
    await product.save();

    const movement = await StockMovement.create({
      product: productId,
      type: 'exit',
      quantity: Number(quantity),
      note: note || '',
    });

    await movement.populate('product', 'name unit');
    res.status(201).json({ success: true, data: movement, updatedProduct: product });
  } catch (err) {
    next(err);
  }
};

module.exports = { addStock, removeStock };
