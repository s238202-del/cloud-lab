const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV !== 'production'
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// 2. Middleware
app.use(express.json());

// 3. Student model
const studentSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});

const Student = mongoose.model('Student', studentSchema);

// 4. Test route
app.get('/api/hello', (req, res) => {
  res.json({
    message: 'Hello from the MERN backend!'
  });
});

// 5. Get all students
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({
      message: 'Failed to fetch students'
    });
  }
});

// 6. Add a student
app.post('/api/students', async (req, res) => {
  try {
    const { studentId, name, email } = req.body;

    const student = new Student({
      studentId,
      name,
      email
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (error) {
    console.error('Error adding student:', error);
    res.status(500).json({
      message: 'Failed to add student'
    });
  }
});

// 7. Update a student by MongoDB _id
app.put('/api/students/:id', async (req, res) => {
  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStudent) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.json(updatedStudent);
  } catch (error) {
    console.error('Error updating student:', error);
    res.status(500).json({
      message: 'Failed to update student'
    });
  }
});

// 8. Delete a student by MongoDB _id
app.delete('/api/students/:id', async (req, res) => {
  try {
    const deletedStudent = await Student.findByIdAndDelete(
      req.params.id
    );

    if (!deletedStudent) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.json({
      message: 'Student deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting student:', error);
    res.status(500).json({
      message: 'Failed to delete student'
    });
  }
});

// 9. Start server and connect to MongoDB
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
  });