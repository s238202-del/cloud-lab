import { useEffect, useState } from "react";

function App() {
  const [students, setStudents] = useState([]);

  const [studentId, setStudentId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    fetch("https://didactic-spoon-qvp7qp6479q4265xr-5000.app.github.dev/api/students")
      .then((response) => response.json())
      .then((data) => setStudents(data))
      .catch((error) => console.error("Error:", error));
  }, []);

  const addStudent = async () => {
  try {
    const response = await fetch("https://didactic-spoon-qvp7qp6479q4265xr-5000.app.github.dev/api/students", {
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

    setStudentId("");
    setName("");
    setEmail("");
  } catch (error) {
    console.error("Error:", error);
  }
};

  return (
    <div>
      <h1>Student Management</h1>

      <h2>Add Student</h2>

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

      <button onClick={addStudent}>Add Student</button>

      <h2>Student List</h2>

      {students.map((student) => (
        <div key={student._id}>
          <p>MSSV: {student.studentId}</p>
          <p>Họ tên: {student.name}</p>
          <p>Email: {student.email}</p>
          <hr />
        </div>
      ))}
    </div>
  );
}

export default App;