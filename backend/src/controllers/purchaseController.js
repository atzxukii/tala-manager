const PurchaseList = require('../models/PurchaseList');

// GET /api/purchases
const getPurchaseLists = async (req, res, next) => {
  try {
    const lists = await PurchaseList.find().sort({ createdAt: -1 });
    res.json({ success: true, data: lists });
  } catch (err) {
    next(err);
  }
};

// GET /api/purchases/:id
const getPurchaseListById = async (req, res, next) => {
  try {
    const list = await PurchaseList.findById(req.params.id);
    if (!list) return res.status(404).json({ success: false, message: 'Liste introuvable' });
    res.json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

// POST /api/purchases — Sauvegarder une liste d'achat (draft)
const createPurchaseList = async (req, res, next) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'La liste ne peut pas être vide' });
    }
    
    // Calculer le montant total
    const totalAmount = items.reduce((total, item) => total + (item.quantity * (item.price || 0)), 0);
    
    const list = await PurchaseList.create({ items, status: 'draft', totalAmount });
    res.status(201).json({ success: true, data: list });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/purchases/:id
const deletePurchaseList = async (req, res, next) => {
  try {
    const list = await PurchaseList.findByIdAndDelete(req.params.id);
    if (!list) return res.status(404).json({ success: false, message: 'Liste introuvable' });
    res.json({ success: true, message: 'Liste supprimée' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getPurchaseLists, getPurchaseListById, createPurchaseList, deletePurchaseList };
