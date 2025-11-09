import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../Auth/api"; // ✅ axios instance with interceptors

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const navigate = useNavigate();

  const userId = sessionStorage.getItem("userid");

  // ✅ Fetch all courses
  const fetchCourses = useCallback(async () => {
    try {
      const res = await api.get("/courses");
      setCourses(res.data);
      setFilteredCourses(res.data);
    } catch (err) {
      console.error("❌ Failed to fetch courses:", err);
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Fetch enrolled courses
  const fetchEnrolledCourses = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/enrollments/user/${userId}`);
      const enrolledIds = res.data.map((e) => e.courseId);
      setEnrolledCourses(enrolledIds);
    } catch (err) {
      console.error("❌ Failed to fetch enrolled courses:", err);
      toast.error("Failed to load your enrollments");
    }
  }, [userId]);

  // ✅ Run on mount
  useEffect(() => {
    fetchCourses();
    fetchEnrolledCourses();
  }, [fetchCourses, fetchEnrolledCourses]);

  // 🔍 Search handler
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const filtered = courses.filter(
      (c) =>
        c.title.toLowerCase().includes(value) ||
        c.instructor.toLowerCase().includes(value) ||
        c.description.toLowerCase().includes(value)
    );
    setFilteredCourses(filtered);
  };

  // ✅ Correct working image URL (copied from AllCourses)
  const getImageUrl = (path) => {
    if (!path) return null;
    const fixedPath = path.replace(/\\/g, "/");
    return `http://localhost:8080/${fixedPath}`;
  };

  // 🎯 Enroll handler
  const handleEnroll = async (courseId) => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      await api.post(`/enrollments/enroll/${userId}/${courseId}`);
      toast.success("🎉 Enrolled successfully!");
      setEnrolledCourses((prev) => [...prev, courseId]);
      fetchCourses(); // optional refresh
    } catch (err) {
      if (
        err.response &&
        err.response.data &&
        err.response.data.includes("Already enrolled")
      ) {
        toast.info("📚 You are already enrolled in this course.");
      } else {
        toast.error("❌ Enrollment failed. Please try again.");
      }
      console.error("Enrollment failed:", err);
    }
  };

  // 🧭 Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 fs-4 fw-semibold">
        Loading Courses...
      </div>
    );
  }

  return (
    <div className="container-fluid py-5 px-4 bg-light min-vh-100">
      <ToastContainer position="top-center" autoClose={2500} />

      {/* Header + Search */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-5">
        <h1 className="fw-bold text-dark display-6 mb-3 mb-md-0">
          Explore Our Courses
        </h1>

        <div
          className="input-group w-100 w-md-50 shadow-sm"
          style={{ maxWidth: "400px" }}
        >
          <span className="input-group-text bg-primary text-white fw-bold">
            🔍
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, instructor..."
            value={search}
            onChange={handleSearch}
          />
        </div>
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center fs-5 text-muted mt-5">
          No courses found matching your search.
        </div>
      ) : (
        <div className="row g-4">
          {filteredCourses.map((course) => {
            const isEnrolled = enrolledCourses.includes(course.id);
            const imageUrl = getImageUrl(course.imagePath);

            return (
              <div
                key={course.id}
                className="col-12 col-sm-6 col-md-4 col-lg-3 d-flex align-items-stretch"
              >
                <div
                  className="card border-0 shadow-lg rounded-4 overflow-hidden w-100 h-100 course-card"
                  style={{
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  }}
                >
                  {/* ✅ Course Image */}
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={course.title}
                      className="card-img-top"
                      style={{
                        height: "220px",
                        objectFit: "cover",
                        width: "100%",
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src =
                          "https://via.placeholder.com/400x220?text=No+Image";
                      }}
                    />
                  ) : (
                    <div
                      className="d-flex align-items-center justify-content-center bg-secondary text-white"
                      style={{ height: "220px" }}
                    >
                      No Image
                    </div>
                  )}

                  {/* ✅ Course Details */}
                  <div className="card-body d-flex flex-column bg-light">
                    <h5 className="fw-bold text-primary mb-2">
                      {course.title}
                    </h5>
                    <p className="text-muted flex-grow-1 small mb-3">
                      {course.description?.length > 100
                        ? course.description.substring(0, 100) + "..."
                        : course.description}
                    </p>

                    <div className="mb-2 small">
                      <p className="mb-1 text-secondary">
                        👨‍🏫 <strong>Instructor:</strong> {course.instructor}
                      </p>
                      <p className="mb-1 text-secondary">
                        👥 <strong>Enrolled:</strong> {course.enrolledCount} /{" "}
                        {course.capacity}
                      </p>
                    </div>

                    <button
                      className={`btn mt-auto w-100 fw-semibold ${
                        isEnrolled ? "btn-success disabled" : "btn-primary"
                      }`}
                      onClick={() => !isEnrolled && handleEnroll(course.id)}
                    >
                      {isEnrolled ? "✅ Enrolled" : "Enroll Now"}
                    </button>
                  </div>

                  {/* ✅ Footer */}
                  <div className="card-footer bg-dark text-center">
                    <span className="badge bg-warning text-dark px-3 py-2">
                      #{course.id}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>
        {`
          .course-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.15);
          }
        `}
      </style>
    </div>
  );
};

export default Courses;
