const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  make: String,
  model: String,
  licensePlate: String,
  initialMileage: Number,
  currentLocation: {
    lat: Number,
    lng: Number
  },
  maintenanceDue: Date,
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
