const PurchaseList = require('../models/PurchaseList');
const nodemailer = require('nodemailer');

const sendRealEmail = async (to, subject, text) => {
  if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD || process.env.SMTP_EMAIL === 'votre_email@gmail.com') {
    return false;
  }
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });
  await transporter.sendMail({
    from: `"Tala Coffee Shop" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
  });
  return true;
};

/**
 * Simulation d'envoi email (MVP — pas de SMTP réel)
 * POST /api/email/send
 *
 * Body: { listId, recipient: { name, email } }
 *
 * Retourne l'email simulé avec objet + corps formaté.
 */
const sendEmailSimulation = async (req, res, next) => {
  try {
    const { listId, recipient } = req.body;

    if (!listId || !recipient?.email) {
      return res.status(400).json({ success: false, message: 'listId et recipient.email sont requis' });
    }

    const list = await PurchaseList.findById(listId);
    if (!list) return res.status(404).json({ success: false, message: 'Liste introuvable' });

    if (list.items.length === 0) {
      return res.status(400).json({ success: false, message: 'La liste est vide' });
    }

    // Générer le corps de l'email
    const itemLines = list.items
      .map((item) => `  - ${item.productName} : ${item.quantity} ${item.unit}`)
      .join('\n');

    const emailBody = `Bonjour,

Voici la liste des produits à acheter :

${itemLines}

Merci.

— Coffee Shop Manager`;

    const emailObject = {
      from: 'manager@coffeeshop.com',
      to: recipient.email,
      subject: 'Liste d\'achat - Coffee Shop',
      body: emailBody,
      simulatedAt: new Date().toISOString(),
    };

    // Marquer la liste comme envoyée
    list.status = 'sent';
    list.sentTo = recipient.email;
    list.sentToName = recipient.name || '';
    list.sentAt = new Date();
    list.emailBody = emailBody;
    await list.save();

    const sentReal = await sendRealEmail(emailObject.to, emailObject.subject, emailObject.body);

    if (!sentReal) {
      console.log('\n📧 EMAIL SIMULÉ ----------------------------');
      console.log(`To      : ${emailObject.to}`);
      console.log(`Subject : ${emailObject.subject}`);
      console.log(`Body    :\n${emailObject.body}`);
      console.log('--------------------------------------------\n');
    }

    res.json({
      success: true,
      message: sentReal ? `Email envoyé avec succès à ${recipient.email}` : `Email simulé envoyé à ${recipient.email}`,
      email: emailObject,
      updatedList: list,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/email/resend/:listId
 * Renvoyer une liste déjà envoyée
 */
const resendEmail = async (req, res, next) => {
  try {
    const list = await PurchaseList.findById(req.params.listId);
    if (!list) return res.status(404).json({ success: false, message: 'Liste introuvable' });

    const { recipient } = req.body;
    const to = recipient?.email || list.sentTo;

    if (!to) return res.status(400).json({ success: false, message: 'Aucun destinataire défini' });

    const emailObject = {
      from: 'manager@coffeeshop.com',
      to,
      subject: 'Liste d\'achat - Coffee Shop (renvoi)',
      body: list.emailBody,
      simulatedAt: new Date().toISOString(),
    };

    list.sentAt = new Date();
    await list.save();

    const sentReal = await sendRealEmail(emailObject.to, emailObject.subject, emailObject.body);

    if (!sentReal) {
      console.log('\n📧 EMAIL RE-SIMULÉ -------------------------');
      console.log(`To      : ${emailObject.to}`);
      console.log(`Subject : ${emailObject.subject}`);
      console.log(`Body    :\n${emailObject.body}`);
      console.log('--------------------------------------------\n');
    }

    res.json({ success: true, message: sentReal ? `Email renvoyé avec succès à ${to}` : `Email re-simulé envoyé à ${to}`, email: emailObject });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendEmailSimulation, resendEmail };
