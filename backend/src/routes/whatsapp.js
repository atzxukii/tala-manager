const express = require('express');
const router = express.Router();
const { markAsSent } = require('../controllers/whatsappController');

router.post('/mark-sent', markAsSent);

module.exports = router;
