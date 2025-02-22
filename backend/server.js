const express = require('express');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/playground', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Employee Schema & Model
const Employee = mongoose.model('Employee', new mongoose.Schema({
  id: Number,
  name: String,
  department: String,
  role: String,
  salary: Number,
  status: String
}));

// Route to add a new employee
app.post('/add-employee', async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get all employees
app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to receive data from app.js and save to MongoDB
app.post('/app-data', async (req, res) => {
  try {
    const data = req.body;
    const newEmployee = new Employee(data);
    await newEmployee.save();
    res.status(201).json({ message: "Data saved successfully", data: newEmployee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
