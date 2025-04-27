const express = require("express")
const router = express.Router()
const userController = require("../controllers/userController")

// Register a new user
router.post("/register", userController.registerUser)

// Login user
router.post("/login", userController.loginUser)

// Get user profile (protected route)
router.get("/profile", userController.protect, userController.getUserProfile)

module.exports = router
