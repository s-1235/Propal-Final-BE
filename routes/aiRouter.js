const express = require('express');
const { generateDescription } = require('../controllers/aiController');

const router = express.Router(); // Initialize the Router

// console.log('routerr reach');
router.route('/description').post(generateDescription);

module.exports = router;
