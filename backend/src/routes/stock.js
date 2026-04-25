const express = require('express');
const router = express.Router();
const { addStock, removeStock } = require('../controllers/stockController');

router.post('/entry', addStock);
router.post('/exit', removeStock);

module.exports = router;
