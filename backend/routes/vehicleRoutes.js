const express = require('express');
const router = express.Router();
const Vehicle = require('../models/Vehicle');

// Add Vehicle
router.post('/add', async (req, res) => {
  try {
    const newVehicle = new Vehicle(req.body);
    await newVehicle.save();
    res.status(201).json({ message: "Vehicle Added Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all Vehicles
router.get('/', async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
