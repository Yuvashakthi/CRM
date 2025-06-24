const express = require('express');
const projectController = require('../controllers/projectController'); // Ensure correct path
const clientController = require('../controllers/clientController.js');
const router = express.Router();



// Correct order matters!


router.post('/api/projects', projectController.createProject);
router.get("/projectView", projectController.renderAllProjects);
router.get("/client/:clientId", projectController.getProjectsByClientId);
router.get('/api/projects/next-id', projectController.getNextProjectId); // ✅ PLACE THIS FIRST
router.get("/api/projects/:projectId", projectController.getProjectById); // This must come after next-id

router.get('/api/clients/fetch', projectController.fetchClient);
router.post('/projects/update/:projectId', projectController.updateProject);
router.get('/clients/:clientId', clientController.getClientById);




module.exports = router;
