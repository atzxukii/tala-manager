const ChatMessage = require('../models/ChatMessage');

// GET /api/chat
const getMessages = async (req, res, next) => {
  try {
    // Récupère les 50 derniers messages, triés du plus ancien au plus récent
    const messages = await ChatMessage.find().sort({ createdAt: 1 }).limit(50);
    res.json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

// POST /api/chat
const addMessage = async (req, res, next) => {
  try {
    const { sender, senderName, content, role } = req.body;

    if (!sender || !content) {
      return res.status(400).json({ success: false, message: 'Le contenu est requis' });
    }

    const newMessage = await ChatMessage.create({
      sender,
      senderName,
      content,
      role
    });

    res.status(201).json({ success: true, data: newMessage });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/chat/:id
const deleteMessage = async (req, res, next) => {
  try {
    const message = await ChatMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ success: false, message: 'Message introuvable' });
    
    res.json({ success: true, message: 'Message supprimé' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMessages, addMessage, deleteMessage };
