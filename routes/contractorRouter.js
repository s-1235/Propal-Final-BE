const express = require("express");
const {
  getContractor,
  getAllContractors,
  createContractor,
  updateContractor,
  deleteContractor,
} = require("../controllers/contractorController");
const { protect } = require("../controllers/authController");
const router = express.Router(); //Initialize Router
router.use(protect);
router.route("/").get(getAllContractors); // Routing for user/

router.route("/:id").get(getContractor).delete(deleteContractor); // Routing for user/any-id-here

module.exports = router;
