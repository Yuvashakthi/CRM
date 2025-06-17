const express = require('express');
const multer = require('multer');
const path = require('path');
const clientController = require('../controllers/clientController.js'); // ensure correct extension



const router = express.Router();

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });


// API Route to Get Clients
router.post('/api/clients', upload.single('Profile'), clientController.createClient);
router.get('/clients', clientController.getClients);
router.get('/clients/:clientId', clientController.getClientById);
router.get('/api/clients/next-id', clientController.getNextClientId);
router.delete('/clients/:id', clientController.deleteClient);
router.get('/clients/edit/:clientId', clientController.editClientForm);
router.post('/clients/update/:clientId', upload.single('Profile'), clientController.updateClient);



module.exports = router;

