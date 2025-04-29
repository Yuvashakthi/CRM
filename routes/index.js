const express = require('express');
const router = express.Router();

router.get('/dashboard', (req, res) => res.render('dashboard'));
router.get('/projectCreate', (req, res) => res.render('projectCreate'));
router.get('/clients', (req, res) => res.render('clients', { clients: [] })); // Add clients data from DB
router.get('/customersView', (req, res) => res.render('customersView'));
router.get('/customersCreate', (req, res) => res.render('customersCreate'));

module.exports = router;
