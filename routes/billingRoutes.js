const express = require('express');
const router = express.Router();
const billingController = require('../controllers/billingController');
const multer = require('multer');

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// GET route to render EJS billing form (optional)
router.get('/billing', (req, res) => {
  res.render('billing'); // views/billing.ejs
});

// POST route to handle form submission
router.post('/billing/create', upload.single('billingFile'), billingController.createBilling);

module.exports = router;
