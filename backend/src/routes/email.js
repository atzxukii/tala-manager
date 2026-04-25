const express = require('express');
const router = express.Router();
const { sendEmailSimulation, resendEmail } = require('../controllers/emailController');

router.post('/send', sendEmailSimulation);
router.post('/resend/:listId', resendEmail);

module.exports = router;
