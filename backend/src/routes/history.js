const express = require('express');
const router = express.Router();
const { getHistory } = require('../controllers/historyController');

// GET /api/history?productId=...&startDate=...&endDate=...&type=entry|exit
router.get('/', getHistory);

module.exports = router;
