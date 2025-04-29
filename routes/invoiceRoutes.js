const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');
const multer = require('multer');

const upload = multer({ dest: 'temp/' });

router.post('/create', upload.single('invoiceFile'), invoiceController.createInvoice);
router.get('/invoiceView', invoiceController.renderInvoiceView); 
router.get('/', invoiceController.getAllInvoices);
router.get('/:id', invoiceController.getInvoice);
router.get('/download/:invoiceId', invoiceController.downloadInvoiceFile);
router.get('/client/:clientId', invoiceController.getInvoicesByClientId);
router.put('/:invoiceId', invoiceController.updateInvoice);



module.exports = router;
