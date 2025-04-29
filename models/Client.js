const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
  clientId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  companyName: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  address: { type: String },
  role: { type: String },
  dob: { type: Date },
  country: { type: String },
  state: { type: String },
  city: { type: String },
  currency: { type: String },
  maritalStatus: { type: String },
  marriageDate: { type: Date },
  houseAddress: { type: String },
  companyStartDate: { type: Date, required: true },
  companyIdNumber: { type: String, required: true },
  industryType: { type: String },
  businessType: { type: String },
  avatar: { type: String },
}, {
  timestamps: true
});

const Client = mongoose.model('Client', clientSchema);

module.exports = Client;
