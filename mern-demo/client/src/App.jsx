import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/students";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editingId, setEditingId] = useState(null);

  // Get students
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Add or update student
  const handleSubmit = async () => {
    try {
      if (editingId) {
        // Update existing student
        const response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            name,
            email,
          }),
        });

        const updatedStudent = await response.json();

        setStudents(
          students.map((student) =>
            student._id === editingId ? updatedStudent : student
          )
        );

        setEditingId(null);
      } else {
        // Add new student
        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId,
            name,
            email,
          }),
        });

        const newStudent = await response.json();

        setStudents([...students, newStudent]);
      }

      // Clear form
      setStudentId("");
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Start editing a student
  const editStudent = (student) => {
    setEditingId(student._id);
    setStudentId(student.studentId);
    setName(student.name);
    setEmail(student.email);
  };

  // Delete student
  const deleteStudent = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      setStudents(
        students.filter((student) => student._id !== id)
      );
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setStudentId("");
    setName("");
    setEmail("");
  };

  return (
    <div>
      <h1>Student Management</h1>

      <h2>{editingId ? "Edit Student" : "Add Student"}</h2>

      <input
        type="text"
        placeholder="MSSV"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />

      <input
        type="text"
        placeholder="Họ tên"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button onClick={handleSubmit}>
        {editingId ? "Update Student" : "Add Student"}
      </button>

      {editingId && (
        <button onClick={cancelEdit}>
          Cancel
        </button>
      )}

      <h2>Student List</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>MSSV: {student.studentId}</p>
          <p>Họ tên: {student.name}</p>
          <p>Email: {student.email}</p>

          <button onClick={() => editStudent(student)}>
            Edit
          </button>

          <button onClick={() => deleteStudent(student._id)}>
            Delete
          </button>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;