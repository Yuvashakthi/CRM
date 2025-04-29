const express = require('express');
const projectController = require('../controllers/projectController'); // Ensure correct path

const router = express.Router();



// Route for creating a project
router.post('/api/projects', projectController.createProject);
router.get("/projectView", projectController.renderAllProjects);
router.get("/client/:clientId", projectController.getProjectsByClientId);
router.get("/api/projects/:projectId", projectController.getProjectById);





module.exports = router;
