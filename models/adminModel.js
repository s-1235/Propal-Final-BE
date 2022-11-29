const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const adminSchema = new Schema({
  name: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "can't be blank"],
  },
  password: { type: String, required: true },
});

const Admin = model('Admin', adminSchema);
module.exports = Admin;
