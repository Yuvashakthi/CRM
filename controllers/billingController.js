const path = require('path');
const fs = require('fs');
const Billing = require('../models/Billing');
const Client = require('../models/Client'); // make sure Client model exists

exports.createBilling = async (req, res) => {
  try {
    const { billingId, clientId, paidDate, paidAmount, status } = req.body;

    // Check for existing billing ID
    const existingBilling = await Billing.findOne({ billingId });
    if (existingBilling) {
      return res.status(400).json({ error: 'Billing with this ID already exists' });
    }

    // Validate client ID
    const clientExists = await Client.findOne({ clientId });
    if (!clientExists) {
      return res.status(400).json({ error: 'Invalid client ID. Client does not exist.' });
    }

    // Handle file upload
    let fileUrl = '';
    if (req.file) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const fileExt = path.extname(req.file.originalname);
      const fileName = `${billingId}${fileExt}`;
      const finalPath = path.join(uploadDir, fileName);

      fs.renameSync(req.file.path, finalPath);

      // Store as relative URL path
      fileUrl = `/uploads/${fileName}`;
    }

    // Create and save new billing entry
    const newBilling = new Billing({
      billingId,
      clientId,
      paidDate,
      paidAmount,
      status,
      fileUrl
    });

    await newBilling.save();
    res.status(201).json({ message: 'Billing created successfully', billing: newBilling });
  } catch (error) {
    console.error('Error creating billing:', error);
    res.status(500).json({ error: 'Server error while creating billing' });
  }
};

exports.viewBillings = async (req, res) => {
    try {
      const billings = await Billing.find().sort({ paidDate: -1 });
      res.render('billingView', { billings }); 
    } catch (error) {
      console.error('Error fetching billings:', error);
      res.status(500).send('Error loading billing view');
    }
  };
  
  exports.downloadBillingFile = async (req, res) => {
    try {
      const billing = await Billing.findOne({ billingId: req.params.billingId });
  
      if (!billing || !billing.fileUrl) {
        return res.status(404).send('File not found for this billing.');
      }
  
      const absolutePath = path.join(__dirname, '..', billing.fileUrl);
  
      res.download(absolutePath, err => {
        if (err) {
          console.error('Error in billing file download:', err);
          res.status(500).send('Error downloading the file.');
        }
      });
    } catch (error) {
      console.error('Error retrieving billing file:', error);
      res.status(500).send('Server Error');
    }
  };

  // Get all billings by client ID
exports.getBillingsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const billings = await Billing.find({ clientId }).sort({ paidDate: -1 });

    res.json({ billings });
  } catch (error) {
    console.error('Error fetching billings:', error);
    res.status(500).json({ error: 'Server error while fetching billings' });
  }
};


exports.getBillingById = async (req, res) => {
  try {
    const billing = await Billing.findOne({ billingId: req.params.billingId });

    if (!billing) {
      return res.status(404).json({ error: 'Billing not found' });
    }

    res.json(billing);
  } catch (error) {
    console.error('Error fetching billing:', error);
    res.status(500).json({ error: 'Server error while fetching billing' });
  }
};


exports.updateBilling = async (req, res) => {
  try {
    const billingId = req.params.billingId;
    const updates = req.body;

    const billing = await Billing.findOneAndUpdate({ billingId }, updates, { new: true });

    if (!billing) {
      return res.status(404).json({ error: "Billing record not found" });
    }

    res.json({ message: "Billing updated successfully", billing });
  } catch (error) {
    console.error("Error updating billing:", error);
    res.status(500).json({ error: "Server error while updating billing" });
  }
};

