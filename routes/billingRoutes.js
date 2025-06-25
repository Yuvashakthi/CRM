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

router.get('/next-id', billingController.getNextBillingId);   // ① KEEP FIRST!

router.post('/billing/create', upload.single('billingFile'), billingController.createBilling);
router.get('/billingView', billingController.viewBillings);
router.get('/billings/client/:clientId', billingController.getBillingsByClientId);
router.get('/billings/:billingId', billingController.getBillingById);   // after next-id
router.get('/billing/download/:billingId', billingController.downloadBillingFile);
router.put('/billings/:billingId', billingController.updateBilling);


module.exports = router;
