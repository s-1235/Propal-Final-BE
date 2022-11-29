const express = require('express');
const { adminLogin } = require('../controllers/authController');

const router = express.Router(); // Initialize the Router

// console.log('routerr reach');
router.route('/').post(adminLogin);

module.exports = router;
