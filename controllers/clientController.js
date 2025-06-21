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
    const lastClient = await Client.findOne({ clientId: { $regex: /^NP-CLI-\d+$/ } }).sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastClient && lastClient.clientId) {
      const lastId = parseInt(lastClient.clientId.split('-').pop());
      if (!isNaN(lastId)) {
        nextNumber = lastId + 1;
      }
    }  


    

    const formattedClientId = `NP-CLI-${String(nextNumber).padStart(3, '0')}`;

    // Build client data
    const clientData = {
      clientId: formattedClientId,
      name: req.body.name,
      companyName: req.body.companyName,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      role: req.body.role,
      dob: req.body.dob,
      country: req.body.country,
      state: req.body.state,
      city: req.body.city,


      currency: req.body.currency || 'INR', // Default currency if not set
      maritalStatus: req.body.maritalStatus,
      marriageDate: req.body.marriageDate || null,
      houseAddress: req.body.houseAddress,
      companyStartDate: req.body.companyStartDate,
      companyIdNumber: req.body.companyIdNumber,
      industryType: req.body.industryType,
      businessType: req.body.businessType,
      status: req.body.status
    };

    // Add profile image if uploaded
    if (req.file) {
      clientData.Profile = `/uploads/${req.file.filename}`;
    }

    const client = new Client(clientData);
    await client.save();

    res.status(201).json({ message: 'Client created successfully', client });
  } catch (error) {
    console.error('Error creating client:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.getNextClientId = async (req, res) => {
  try {
    const lastClient = await Client.findOne({ clientId: { $regex: /^NP-CLI-\d+$/ } })
      .sort({ createdAt: -1 });

    let nextNumber = 1;
    if (lastClient && lastClient.clientId) {
      const lastId = parseInt(lastClient.clientId.split('-').pop());
      if (!isNaN(lastId)) {
        nextNumber = lastId + 1;
      }
    }

    const formattedClientId = `NP-CLI-${String(nextNumber).padStart(3, '0')}`;
    res.json({ nextClientId: formattedClientId });

  } catch (err) {
    res.status(500).json({ error: 'Failed to generate client ID' });
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

    // If the request expects JSON (e.g., from fetch API)
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.json(client);
    }

    // Else, render the view (normal browser request)
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

// Edit Form
exports.editClientForm = async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) return res.status(404).send('Client not found');
    res.render('clientEdit', { client }); // create this view
  } catch (error) {
    res.status(500).send(error.message);
  }
};

exports.updateClient = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.Profile = `/uploads/${req.file.filename}`;
    }

    const updated = await Client.findByIdAndUpdate(req.params.clientId, updateData, { new: true });
    if (!updated) return res.status(404).send('Client not found');

    res.status(200).json({ message: 'Updated successfully' }); // return JSON response
  } catch (error) {
    res.status(500).send(error.message);
  }
};


exports.getClientList = async (req, res) => {
  try {
    const clients = await Client.find({}, 'clientId'); // Only fetch clientId
    res.json({ clients });
  } catch (err) {
    console.error('Error fetching client list:', err);
    res.status(500).json({ error: 'Failed to fetch client list' });
  }
};