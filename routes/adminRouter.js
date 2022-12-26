const express = require("express");
const { adminLogin } = require("../controllers/authController");
const { adminData } = require("../controllers/adminController");

const router = express.Router(); // Initialize the Router

// console.log('routerr reach');
router.route("/").post(adminLogin);
router.route("/").get(adminData);

module.exports = router;
