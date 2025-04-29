const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: { type: String, required: true },
  projectId: { type: String, required: true, unique: true },
  projectType: { type: String, required: true },
  assignedTo: { type: String },
  startDate: { type: Date },
  endDate: { type: Date },
  status: { type: String },
  cost: { type: Number },
  clientId: { type: String, required: true }, // Change ObjectId to String here
});

const Project = mongoose.model("Project", projectSchema);
module.exports = Project;
