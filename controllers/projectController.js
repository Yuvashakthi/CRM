const mongoose = require("mongoose");
const Project = require("../models/Project");
const Client = require("../models/Client");

exports.createProject = async (req, res) => {
  try {
    console.log("Received project creation request:", req.body);

    const { clientId, projectName, projectId, projectType, assignedTo, startDate, endDate, status, cost } = req.body;

    if (!clientId) {
      console.error("Client ID missing in request");
      return res.status(400).json({ error: "Client ID is required." });
    }

    // Ensure that clientId is passed as a string and not as ObjectId
    const client = await Client.findOne({ clientId: clientId }); // Validate clientId as a string
    if (!client) {
      console.error(`Client ID ${clientId} not found`);
      return res.status(404).json({ error: "Client not found. Please check the Client ID." });
    }

    const newProject = new Project({
      clientId,
      projectName,
      projectId,
      projectType,
      assignedTo,
      startDate,
      endDate,
      status,
      cost,
    });

    await newProject.save();

    console.log("Project created successfully:", newProject);
    res.status(201).json({
      message: "Project created successfully!",
      project: newProject
    });

  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ projectId });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





// Controller to render all projects in projectView.ejs
exports.renderAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    res.render("projectView", { projects });
  } catch (error) {
    console.error("Error loading projectView:", error);
    res.status(500).send("Error loading project view.");
  }
};

exports.getProjectsByClientId = async (req, res) => {
  try {
    const { clientId } = req.params;
    const projects = await Project.find({ clientId });

    if (!projects.length) {
      return res.status(404).json({ error: "No projects found for this client." });
    }

    res.status(200).json({ projects });
  } catch (error) {
    console.error("Error fetching projects for client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
