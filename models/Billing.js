const mongoose = require('mongoose');

const BillingSchema = new mongoose.Schema({
  billingId: { type: String, required: true, unique: true },
  clientId: { type: String, required: true },
  paidDate: { type: Date, required: true },
  paidAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Paid', 'Unpaid', 'Partial'],
    default: 'Paid'
  },
  fileUrl: { type: String } // path to uploaded file
});

module.exports = mongoose.model('Billing', BillingSchema);
