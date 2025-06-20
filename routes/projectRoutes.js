const express = require('express');
const projectController = require('../controllers/projectController'); // Ensure correct path
const clientController = require('../controllers/clientController.js');
const router = express.Router();



// Route for creating a project
router.post('/api/projects', projectController.createProject);
router.get("/projectView", projectController.renderAllProjects);
router.get("/client/:clientId", projectController.getProjectsByClientId);
router.get("/api/projects/:projectId", projectController.getProjectById);

// 👉 Add this for fetching client by name or ID
router.get('/api/clients/fetch', projectController.fetchClient);
router.post('/projects/update/:projectId', projectController.updateProject);
router.get('/clients/:clientId', clientController.getClientById);




module.exports = router;
