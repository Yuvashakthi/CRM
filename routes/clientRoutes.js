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

// API Route to Create Client
router.post('/api/clients', upload.single('avatar'), clientController.createClient);

// API Route to Get Clients
router.post('/api/clients', upload.single('avatar'), clientController.createClient);
router.get('/clients', clientController.getClients);
router.get('/clients/:clientId', clientController.getClientById);



module.exports = router;

