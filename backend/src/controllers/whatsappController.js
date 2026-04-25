const PurchaseList = require('../models/PurchaseList');

/**
 * Marquer une liste comme envoyée par WhatsApp
 * POST /api/whatsapp/mark-sent
 */
const markAsSent = async (req, res, next) => {
  try {
    const { listId, recipient } = req.body;

    const list = await PurchaseList.findById(listId);
    if (!list) return res.status(404).json({ success: false, message: 'Liste introuvable' });

    list.status = 'whatsapp_sent';
    list.sentTo = recipient.email;
    list.sentToName = recipient.name;
    list.sentToPhone = recipient.phone;
    list.sentAt = new Date();
    await list.save();

    res.json({ success: true, message: 'Liste marquée comme envoyée par WhatsApp' });
  } catch (err) {
    next(err);
  }
};

module.exports = { markAsSent };
