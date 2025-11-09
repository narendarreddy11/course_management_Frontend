import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStudents: 0,
    totalCourses: 0,
    totalEnrollments: 0,
  });
  const [courses, setCourses] = useState([]);
  const token = sessionStorage.getItem("token");
  const adminId = sessionStorage.getItem("userid");
  const effectCalled = useRef(false); // 🧠 guard flag

  useEffect(() => {
    if (effectCalled.current) return; // 🛑 Prevent second execution
    effectCalled.current = true;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchStats = async () => {
      try {
        const [users, students, courses, enrollments] = await Promise.all([
          axios.get("http://localhost:8080/api/admin/users/count", { headers }),
          axios.get("http://localhost:8080/api/admin/students/count", { headers }),
          axios.get("http://localhost:8080/api/admin/courses/count", { headers }),
          axios.get("http://localhost:8080/api/admin/enrollments/count", { headers }),
        ]);
        setStats({
          totalUsers: users.data,
          totalStudents: students.data,
          totalCourses: courses.data,
          totalEnrollments: enrollments.data,
        });
      } catch (error) {
        console.error("Error fetching admin stats:", error);
        toast.error("⚠️ Failed to load dashboard stats!");
      }
    };

    const fetchCoursesByAdmin = async () => {
      try {
        console.log("Fetching courses by admin..."); // ✅ Will log only once
        const res = await axios.get(
          `http://localhost:8080/api/courses/admin/${adminId}`,
          { headers }
        );
        setCourses(res.data);
      } catch (error) {
        console.error("Error fetching admin courses:", error);
        toast.error("⚠️ Failed to load your courses!");
      }
    };

    if (token && adminId) {
      fetchStats();
      fetchCoursesByAdmin();
    }
  }, [token, adminId]);

  return (
    <div className="container py-5">
      <h2 className="text-center text-warning fw-bold mb-4">
        Admin Dashboard 🛠️
      </h2>

      {/* Dashboard Cards */}
      <div className="row g-4 justify-content-center mb-5">
        {[
          { title: "Total Users", value: stats.totalUsers },
          { title: "Total Students", value: stats.totalStudents },
          { title: "Total Courses", value: stats.totalCourses },
          { title: "Total Enrollments", value: stats.totalEnrollments },
        ].map((item, i) => (
          <div key={i} className="col-md-3">
            <div className="card text-center shadow border-0 bg-dark text-white">
              <div className="card-body">
                <h5 className="card-title text-warning">{item.title}</h5>
                <h3>{item.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Courses Section */}
      <h4 className="text-center text-warning mb-3">📚 Courses Created by You</h4>

      {courses.length > 0 ? (
        <div className="row g-4">
          {courses.map((course) => (
            <div key={course.id} className="col-md-4">
              <div className="card shadow border-0">
                <div className="card-body bg-light">
                  <h5 className="card-title text-dark">{course.title}</h5>
                  <p className="card-text text-muted">
                    {course.description?.substring(0, 80) || "No description"}...
                  </p>
                  <span className="badge bg-warning text-dark">
                    {course.category || "General"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-secondary mt-3">
          You haven’t created any courses yet.
        </p>
      )}
    </div>
  );
};

export default AdminDashboard;
