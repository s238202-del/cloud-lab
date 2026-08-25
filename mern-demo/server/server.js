const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: "https://didactic-spoon-qvp7qp6479q4265xr-5173.app.github.dev",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const studentSchema = new mongoose.Schema({
    studentId: String,
    name: String,
    email: String
});
const Student = mongoose.model("Student", studentSchema);

mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connected successfully");
    })
    .catch((err) => {
        console.error("MongoDB connection failed:", err);
    });

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
app.get("/api/hello", (req, res) => {
    res.json({message:"Backend is working."});
});

app.get("/api/students", async(req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    }
    catch(err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/api/students", async(req, res) => {
    try {
        const student = await Student.create(req.body);
        res.status(201).json(student);
    }
    catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.put("/api/students/:id", async(req, res) => {
    try {
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if(!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json(student);
    }
    catch(err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete("/api/students/:id", async(req,res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if(!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        res.json({ message: "Student deleted successfully"});
    }
    catch(err) {
        res.status(400).json({ error: err.message});
    }
});