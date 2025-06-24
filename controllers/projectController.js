const mongoose = require("mongoose");
const Project = require("../models/Project");
const Client = require("../models/Client");
exports.createProject = async (req, res) => {
  try {
    const {
      clientId, clientName, department, projectName,
      projectType, assignedTo, startDate, endDate, status, cost
    } = req.body;

    if (!clientId) {
      return res.status(400).json({ error: "Client ID is required." });
    }

    // Validate client
    const client = await Client.findOne({ clientId });
    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    // ✅ Generate unique projectId (server-side only)
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const prefix = `PRO-${month}-`;

    // Find the last used project ID
    const lastProject = await Project.findOne({ projectId: { $regex: `^${prefix}` } })
      .sort({ projectId: -1 });

    let nextNumber = 1;
    if (lastProject && lastProject.projectId) {
      const lastNum = parseInt(lastProject.projectId.split('-')[2]);
      if (!isNaN(lastNum)) {
        nextNumber = lastNum + 1;
      }
    }

    const projectId = `${prefix}${String(nextNumber).padStart(3, '0')}`;

    // Save the new project
    const newProject = new Project({
      projectId, // now generated on the server
      clientId,
      clientName,
      department,
      projectName,
      projectType,
      assignedTo,
      startDate,
      endDate,
      status,
      cost
    });

    await newProject.save();

    res.status(201).json({ message: "Project created successfully!", project: newProject });

  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: error.message });
  }
};


exports.getProjectById = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId); // Use _id not projectId field

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error("Error fetching project by ID:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};





exports.renderAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({});
    const clients = await Client.find({});

    const enrichedProjects = projects.map(project => {
      const client = clients.find(c => c.clientId === project.clientId);
      return {
        ...project.toObject(),
        clientObjectId: client ? client._id : null
      };
    });

    res.render("projectView", { projects: enrichedProjects }); // ✅ Do not render 'clients'
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


// Controller to fetch client by clientId or name (for auto-fill in frontend)
exports.fetchClient = async (req, res) => {
  try {
    const { id, name } = req.query;
    let client;

    if (id) {
      client = await Client.findOne({ clientId: id.trim() });
    } else if (name) {
      client = await Client.findOne({ name: name.trim() });
    }

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.status(200).json({ client });
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.projectId, req.body, { new: true });
    if (!updated) return res.status(404).json({ error: 'Project not found' });

    res.status(200).json({ message: 'Project updated successfully', project: updated });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNextProjectId = async (req, res) => {
  try {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Current month
    const prefix = `PRO-${month}-`;

    // ✅ Find latest project in this month
    const lastProject = await Project.findOne({ projectId: { $regex: `^${prefix}` } })
      .sort({ projectId: -1 }); // sort by ID, not createdAt

    let nextNumber = 1;
    if (lastProject && lastProject.projectId) {
      const lastIdPart = lastProject.projectId.split('-')[2]; // get the XXX
      const lastNumber = parseInt(lastIdPart);
      if (!isNaN(lastNumber)) {
        nextNumber = lastNumber + 1;
      }
    }

    const nextProjectId = `${prefix}${String(nextNumber).padStart(3, '0')}`;
    res.json({ nextProjectId });
  } catch (error) {
    console.error("Error generating project ID:", error);
    res.status(500).json({ error: "Failed to generate project ID" });
  }
};




