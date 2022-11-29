const express = require('express');
const {
  getUser,
  getAllUser,
  createUser,
  updateUser,
  deleteUser,
} = require('./../controllers/userController');

const { signUp, login } = require('./../controllers/authController');

const router = express.Router(); //Initialize Router
router.route('/signup').post(signUp);
router.route('/login').post(login);

router.route('/').get(getAllUser).post(createUser); // Routing for user/

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser); // Routing for user/any-id-here

module.exports = router;
