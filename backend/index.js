const express=require('express')
const mongoose = require("mongoose")
const cors = require("cors")
const path = require('path');

const connectDB=require('./db.js')
const app=express()
connectDB()
app.use(cors());
app.use(express.json());



const EmployeeSchema = new mongoose.Schema({
    name: String,
    department: String,
    role: String,
    salary: Number,
    status: String,
});

const Employee = mongoose.model("Employee", EmployeeSchema);

// Get all employees
app.get("/employees", async (req, res) => {
    const employees = await Employee.find();
    res.json(employees);
});

// Add new employee
app.post("/employees", async (req, res) => {
    const newEmployee = new Employee(req.body);
    await newEmployee.save();
    res.json(newEmployee);
});

// Update employee
app.put("/employees/:id", async (req, res) => {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmployee);
});

// Delete employee
app.delete("/employees/:id", async (req, res) => {
    try {
        const deletedEmployee = await Employee.findByIdAndDelete(req.params.id);
        if (!deletedEmployee) {
            return res.status(404).json({ message: "Employee not found" });
        }
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting employee", error });
    }
});




app.listen(3000,()=>{
    console.log("emptable is running");
})