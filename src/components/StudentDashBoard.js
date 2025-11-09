import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Auth/api";
import { Modal, Button } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function StudentDashboard() {
  const username = sessionStorage.getItem("username") || "Student";
  const userId = sessionStorage.getItem("userid");
  const navigate = useNavigate();

  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // ✅ Fetch enrolled courses and all courses
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [enrolledRes, allCoursesRes] = await Promise.all([
          api.get(`/enrollments/student/${userId}`),
          api.get(`/courses`),
        ]);

        setEnrolledCourses(enrolledRes.data);
        setTrendingCourses(allCoursesRes.data.slice(0, 3)); // top 3 trending
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        toast.error("Failed to load dashboard data");
      }
    };

    fetchDashboardData();
  }, [userId]);

  // Derived counts
  const totalEnrolled = enrolledCourses.length;
  const completedCourses = enrolledCourses.filter(
    (e) => e.status === "COMPLETED"
  ).length;
  const activeCourses = totalEnrolled - completedCourses;

  // ✅ Open modal to view course details
  const handleViewCourse = async (courseId) => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setSelectedCourse(res.data);
      setShowModal(true);
    } catch (err) {
      console.error("Error fetching course details:", err);
      toast.error("Failed to fetch course details");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedCourse(null);
  };

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {/* Welcome Banner */}
      <div className="p-5 text-center bg-primary text-white rounded-4 shadow-sm mb-5">
        <h2 className="fw-bold mb-2">Welcome back, {username}! 👋</h2>
        <p className="lead">
          Let’s continue your learning journey and explore new courses today.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="row text-center mb-5">
        <div className="col-md-4 mb-3">
          <div className="card shadow-lg border-0 rounded-4 p-3">
            <div className="card-body">
              <h5 className="card-title fw-bold text-primary">
                Enrolled Courses
              </h5>
              <h2 className="fw-bolder">{totalEnrolled}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-lg border-0 rounded-4 p-3">
            <div className="card-body">
              <h5 className="card-title fw-bold text-success">
                Courses Completed
              </h5>
              <h2 className="fw-bolder">{completedCourses}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-3">
          <div className="card shadow-lg border-0 rounded-4 p-3">
            <div className="card-body">
              <h5 className="card-title fw-bold text-warning">
                Active Courses
              </h5>
              <h2 className="fw-bolder">{activeCourses}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Learning */}
      <div className="mb-5">
        <h4 className="fw-bold text-secondary mb-3">📘 Continue Learning</h4>
        <div className="alert alert-info rounded-4 shadow-sm p-4">
          You’re currently enrolled in{" "}
          <strong>{activeCourses}</strong> courses. Keep up the momentum and
          finish your next lesson today!
        </div>
      </div>

      {/* Trending Courses */}
      <div className="mb-5">
        <h4 className="fw-bold text-secondary mb-4">
          🔥 Recommended / Trending Courses
        </h4>
        <div className="row">
          {trendingCourses.map((course) => (
            <div key={course.id} className="col-md-4 mb-4">
              <div className="card border-0 shadow-lg rounded-4 hover-shadow transition">
                <div className="card-body">
                  <h5 className="fw-bold">{course.title}</h5>
                  <p className="text-muted mb-2">
                    {course.level || "All Levels"}
                  </p>
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleViewCourse(course.id)}
                  >
                    View Course
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="d-flex justify-content-center gap-3 mt-5 mb-5">
        <button
          className="btn btn-lg btn-primary px-4 rounded-4 shadow-sm"
          onClick={() => navigate("/courses")}
        >
          Browse All Courses
        </button>
        <button
          className="btn btn-lg btn-outline-secondary px-4 rounded-4 shadow-sm"
          onClick={() => navigate("/userenrolled")}
        >
          View My Enrollments
        </button>
      </div>

      {/* Modal for Course Details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCourse ? selectedCourse.title : "Course Details"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse ? (
            <>
              <p>
                <strong>Description:</strong> {selectedCourse.description}
              </p>
              <p>
                <strong>Category:</strong> {selectedCourse.category}
              </p>
              <p>
                <strong>Instructor:</strong> {selectedCourse.instructorName}
              </p>
              <p>
                <strong>Duration:</strong> {selectedCourse.duration} hours
              </p>
              <p>
                <strong>Capacity:</strong> {selectedCourse.capacity}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default StudentDashboard;
