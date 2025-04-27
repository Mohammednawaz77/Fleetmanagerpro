const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
require("dotenv").config()

const app = express()

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.error("MongoDB connection error:", err))

// Import routes
const userRoutes = require("./api/routes/userRoutes")

// Use routes
app.use("/api/users", userRoutes)

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Fleet Manager Pro API is running")
})

// Add this route after your other routes
app.get("/api/test-connection", async (req, res) => {
  try {
    // Check MongoDB connection
    const dbState = mongoose.connection.readyState
    const dbStatus = {
      0: "disconnected",
      1: "connected",
      2: "connecting",
      3: "disconnecting",
    }

    // Test environment variables
    const envVars = {
      mongoDbConnected: dbState === 1,
      mongoDbStatus: dbStatus[dbState],
      jwtSecretSet: !!process.env.JWT_SECRET,
      portSet: !!process.env.PORT,
      nodeEnv: process.env.NODE_ENV || "not set",
    }

    res.json({
      success: true,
      message: "Connection test successful",
      environment: envVars,
    })
  } catch (error) {
    console.error("Connection test error:", error)
    res.status(500).json({
      success: false,
      message: "Connection test failed",
      error: error.message,
    })
  }
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong on the server",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
