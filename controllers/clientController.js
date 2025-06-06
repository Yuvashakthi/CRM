const multer = require('multer');
const path = require('path');
const Client = require('../models/Client');

// Multer Config
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

exports.createClient = async (req, res) => {
  try {
    const clientData = {
      name: req.body.name,
      clientId: req.body.clientId,
      companyName: req.body.companyName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      role: req.body.role,
      dob: req.body.dob,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,
      currency: req.body.currency,
      maritalStatus: req.body.maritalStatus,
      marriageDate: req.body.marriageDate || null,
      houseAddress: req.body.houseAddress,
      companyStartDate: req.body.companyStartDate,
      companyIdNumber: req.body.companyIdNumber,
      industryType: req.body.industryType,
      businessType: req.body.businessType,
    };

    if (req.file) {
      clientData.avatar = `/uploads/${req.file.filename}`;
    }

    const client = new Client(clientData);
    await client.save();
    res.status(201).json({ message: 'Client created successfully', client });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: error.message });
  }
};



exports.getClients = async (req, res) => {
  try {
    const clients = await Client.find({});
    res.render('clients', { clients });
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).send('Error fetching clients');
  }
};

exports.getClientById = async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);

    if (!client) {
      return res.status(404).send('Client not found');
    }
    res.render('customersView', { client });

  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const client = await Client.findByIdAndDelete(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    res.status(500).json({ error: 'Server error while deleting client' });
  }
};

