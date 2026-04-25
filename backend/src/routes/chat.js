const express = require('express');
const router = express.Router();
const { getMessages, addMessage, deleteMessage } = require('../controllers/chatController');

router.get('/', getMessages);
router.post('/', addMessage);
router.delete('/:id', deleteMessage);

module.exports = router;
