const Invoice = require('../models/Invoice');
const Client = require('../models/Client'); //  import Client model
const fs = require('fs');
const path = require('path');

// Create invoice
exports.createInvoice = async (req, res) => {
  try {
    const { invoiceId, creationDate, dueDate, status, clientId, dueAmount } = req.body;
    
    // Check if invoice with same ID already exists
    const existingInvoice = await Invoice.findOne({ invoiceId });
    if (existingInvoice) {
      return res.status(400).json({ error: 'Invoice with this ID already exists' });
    }

    //  Check if client ID is valid
    const clientExists = await Client.findOne({ clientId });
    if (!clientExists) {
      return res.status(400).json({ error: 'Invalid client ID. Client does not exist.' });
    }

    //  Handle file upload if present
    let filePath = '';
    if (req.file) {
      const uploadDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      
      const fileExt = path.extname(req.file.originalname);
      const fileName = `${invoiceId}${fileExt}`;
      filePath = path.join(uploadDir, fileName);
      
      fs.renameSync(req.file.path, filePath);
      filePath = `/uploads/${fileName}`;
    }

    //  Create new invoice
    const invoice = new Invoice({
      invoiceId,
      creationDate,
      dueDate,
      status,
      clientId,
      dueAmount,
      filePath
    });

    await invoice.save();
    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ error: 'Server error while creating invoice' });
  }
};

// Get all invoices
exports.getAllInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ error: 'Server error while fetching invoices' });
  }
};

// Get single invoice
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ invoiceId: req.params.id });
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ error: 'Server error while fetching invoice' });
  }
};


// Renders invoiceView.ejs and passes all invoice data
exports.renderInvoiceView = async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });

    // Test if it works
    if (!invoices || invoices.length === 0) {
      console.log('No invoices found.');
    }

    res.render('invoiceView', { invoices });
  } catch (error) {
    console.error('Error rendering invoice view:', error);
    res.status(500).send('Server error while loading invoices');
  }
};

exports.downloadInvoiceFile = async (req, res) => {
  const invoice = await Invoice.findOne({ invoiceId: req.params.invoiceId });

  if (!invoice || !invoice.filePath) {
    return res.status(404).send('File not found for this invoice.');
  }

  const absolutePath = path.join(__dirname, '..', invoice.filePath);
  res.download(absolutePath, err => {
    if (err) {
      console.error('Error in file download:', err);
      res.status(500).send('Error downloading the file.');
    }
  });
};

// Get invoices by client ID
exports.getInvoicesByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const invoices = await Invoice.find({ clientId }).sort({ createdAt: -1 });
    res.json({ invoices });
  } catch (error) {
    console.error("Error fetching client invoices:", error);
    res.status(500).json({ error: "Server error while fetching invoices" });
  }
};

// Update invoice
exports.updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.invoiceId;
    const updates = req.body;

    const invoice = await Invoice.findOneAndUpdate({ invoiceId }, updates, { new: true });

    if (!invoice) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json({ message: "Invoice updated successfully", invoice });
  } catch (error) {
    console.error("Error updating invoice:", error);
    res.status(500).json({ error: "Server error while updating invoice" });
  }
};

