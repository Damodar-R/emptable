const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI = process.env.MONGO_URI;
require("dotenv").config({ path: "./.env" });

console.log("MongoDB URI:", process.env.MONGO_URI); // Debugging check

if (!mongoURI) {
  console.error("Error: MONGO_URI is not defined in .env file");
  process.exit(1); // Exit the app if MongoDB URI is missing
}

// Connect to MongoDB
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.once("open", () => console.log("Connected to MongoDB"));
db.on("error", (err) => console.error("MongoDB connection error:", err));

app.listen(5000, () => console.log("Server running on port 5000"));
