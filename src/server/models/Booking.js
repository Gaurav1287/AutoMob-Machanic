const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  shopId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userLocation: { type: String, required: true },
  vehicleModel: { type: String, required: true },
  paymentMethod: { type: String, enum: ['Card', 'UPI', 'Cash'], required: true },
  paymentIntentId: { type: String },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);