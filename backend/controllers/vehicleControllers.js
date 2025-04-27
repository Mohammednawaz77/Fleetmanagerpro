const Vehicle = require("../models/V");

// Create new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create({ ...req.body, managerId: req.user.id });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Get all vehicles for manager
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ managerId: req.user.id });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update vehicle location (simulate tracking)
exports.updateLocation = async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { location: { lat, lng }, lastUpdated: Date.now() },
      { new: true }
    );
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete a vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ msg: "Vehicle deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
