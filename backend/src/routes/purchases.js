const express = require('express');
const router = express.Router();
const {
  getPurchaseLists,
  getPurchaseListById,
  createPurchaseList,
  deletePurchaseList,
} = require('../controllers/purchaseController');

router.get('/', getPurchaseLists);
router.get('/:id', getPurchaseListById);
router.post('/', createPurchaseList);
router.delete('/:id', deletePurchaseList);

module.exports = router;
