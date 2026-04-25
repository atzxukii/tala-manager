const Product = require('../models/Product');

// GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().sort({ name: 1 });
    res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/:id
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Produit introuvable' });
    res.json({ success: true, message: 'Produit supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};

// GET /api/products/alerts — Produits en alerte ou rupture
const getAlerts = async (req, res, next) => {
  try {
    const products = await Product.find();
    const alerts = products.filter((p) => p.quantity < p.minThreshold);
    res.json({ success: true, data: alerts });
  } catch (err) {
    next(err);
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct, getAlerts };
