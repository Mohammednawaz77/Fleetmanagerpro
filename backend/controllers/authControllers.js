const User = require("../models/userModel")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

// Register a new user
exports.registerUser = async (req, res) => {
  try {
    console.log("Registration attempt:", req.body)
    const { username, email, password } = req.body

    // Validate input
    if (!username || !email || !password) {
      console.log("Missing required fields:", { username: !!username, email: !!email, password: !!password })
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      })
    }

    // Check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      console.log("User already exists with email:", email)
      return res.status(400).json({
        success: false,
        message: "User with this email already exists",
      })
    }

    // Check if username is taken
    const usernameExists = await User.findOne({ username })
    if (usernameExists) {
      console.log("Username already taken:", username)
      return res.status(400).json({
        success: false,
        message: "Username is already taken",
      })
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password, // Password will be hashed in the model's pre-save hook
    })

    if (user) {
      // Generate JWT token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" })
      console.log("User registered successfully:", user._id)

      res.status(201).json({
        success: true,
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
        token,
      })
    } else {
      throw new Error("Invalid user data")
    }
  } catch (error) {
    console.error("Registration error details:", error)
    res.status(500).json({
      success: false,
      message: "Registration failed: " + error.message,
      error: error.message,
    })
  }
}

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      })
    }

    // Find user by email
    const user = await User.findOne({ email }).select("+password")

    // Check if user exists and password is correct
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      })
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "fallback_secret", { expiresIn: "30d" })

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    })
  }
}

// Protect routes middleware
exports.protect = async (req, res, next) => {
  try {
    let token

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token provided",
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "fallback_secret")

    // Get user from token
    const user = await User.findById(decoded.id)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      })
    }

    // Set user in request
    req.user = user
    next()
  } catch (error) {
    console.error("Auth error:", error)
    res.status(401).json({
      success: false,
      message: "Not authorized",
      error: error.message,
    })
  }
}

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)

    if (user) {
      res.json({
        success: true,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
        },
      })
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
  } catch (error) {
    console.error("Profile error:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
      error: error.message,
    })
  }
}
