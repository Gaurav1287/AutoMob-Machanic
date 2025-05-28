// const mongoose = require('mongoose');

// const ServiceSchema = new mongoose.Schema({
//   shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Link to mechanic
//   name: { type: String, required: true },
//   description: { type: String, required: true },
//   image: { type: String, required: true },
//   type: { type: String, enum: ['Car', 'Bike'], required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Service', ServiceSchema);
const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  offerPrice: { type: Number },
  duration: { type: String, required: true }
});

module.exports = mongoose.model('Service', ServiceSchema);

