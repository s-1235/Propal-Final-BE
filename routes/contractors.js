const express = require('express');
const {
  getContractor,
  getAllContractors,
  createContractor,
  updateContractor,
  deleteContractor,
} = require('./../controllers/contractors');

const { signUp, login } = require('./../controllers/contractorAuthentication');

const router = express.Router(); //Initialize Router
router.route('/signup').post(signUp);
router.route('/login').post(login);

router.route('/').get(getAllContractors).post(createContractor); // Routing for user/

router.route('/:id').get(getContractor).patch(updateContractor).delete(deleteContractor); // Routing for user/any-id-here

module.exports = router;
