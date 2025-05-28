const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  shopName: { type: String },
  location: { type: String },
  contact: { type: String },
  operatingHours: { type: String },
  photos: [{ type: String }],
  certifications: [{ type: String }]
});

module.exports = mongoose.model('User', UserSchema);