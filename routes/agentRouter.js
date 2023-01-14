const express = require("express");
const {
  getAllAgents,
  getAgent,
  createAgent,
  updateagent,
  deleteAgent,
} = require("../controllers/agentController");
const { protect } = require("../controllers/authController");
const router = express.Router(); //Initialize Router
router.use(protect);
router.route("/").get(getAllAgents); // Routing for user/

router.route("/:id").get(getAgent).delete(deleteAgent); // Routing for user/any-id-here

module.exports = router;
