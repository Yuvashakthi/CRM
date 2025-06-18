const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectId: { type: String, required: true, unique: true },
  projectType: { type: String, required: true },
  assignedTo: { type: String },
  department: { type: String }, // ➕ Add department
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String },
  cost: { type: Number },
  clientId: { type: String, required: true },
  clientName: { type: String }, // ➕ Add client name for reference
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
