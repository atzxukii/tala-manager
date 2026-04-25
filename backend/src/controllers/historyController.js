const StockMovement = require('../models/StockMovement');

// GET /api/history
const getHistory = async (req, res, next) => {
  try {
    const { productId, startDate, endDate, type } = req.query;

    const filter = {};
    if (productId) filter.product = productId;
    if (type) filter.type = type;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.date.$lte = end;
      }
    }

    const movements = await StockMovement.find(filter)
      .populate('product', 'name unit category')
      .sort({ date: -1 });

    res.json({ success: true, data: movements, total: movements.length });
  } catch (err) {
    next(err);
  }
};

module.exports = { getHistory };
