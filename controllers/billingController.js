const Billing = require('../models/Billing');

exports.createBilling = async (req, res) => {
  try {
    const { billingId, clientId, paidDate, paidAmount, status } = req.body;
    const fileUrl = req.file ? req.file.path : null;

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
    res.status(500).json({ error: 'Server Error' });
  }
};
