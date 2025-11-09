import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const AllCourses = () => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    capacity: "",
    instructor: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const adminId = sessionStorage.getItem("userid");

  // ✅ Fetch all courses
  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/courses");
      setCourses(res.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("⚠️ Failed to load courses!");
    }
  };

  // ✅ Build correct image URL
  const getImageUrl = (path) => {
    if (!path) return null;
    const fixedPath = path.replace(/\\/g, "/");
    return `http://localhost:8080/${fixedPath}`;
  };

  // ✅ Handle form change
  const handleChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // ✅ Reset form
  const resetForm = () => {
    setCourseData({
      title: "",
      description: "",
      capacity: "",
      instructor: "",
    });
    setImageFile(null);
    setSelectedCourseId(null);
    setIsEditing(false);
    setShowForm(false);
  };

  // ✅ Add or Update Course
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!adminId) {
      toast.error("❌ Admin not logged in!");
      return;
    }

    const formData = new FormData();
    formData.append(
      "course",
      new Blob([JSON.stringify(courseData)], { type: "application/json" })
    );
    if (imageFile) formData.append("image", imageFile);

    try {
      if (isEditing) {
        // 🖋 Update existing
        await axios.put(
          `http://localhost:8080/api/courses/${selectedCourseId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("✅ Course updated successfully!");
      } else {
        // ➕ Create new
        await axios.post(
          `http://localhost:8080/api/courses/create/${adminId}`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        toast.success("🎉 Course added successfully!");
      }

      resetForm();
      fetchCourses();
    } catch (error) {
      console.error("Error submitting course:", error);
      toast.error("❌ Failed to save course.");
    }
  };

  // 🗑 Delete Course
  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Delete this course permanently?")) return;

    try {
      await axios.delete(`http://localhost:8080/api/courses/${id}`);
      toast.success("🗑 Course deleted successfully!");
      setCourses((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("❌ Failed to delete course.");
    }
  };

  // 🖋 Edit Course (Prefill form)
  const handleEdit = (course) => {
    setIsEditing(true);
    setSelectedCourseId(course.id);
    setCourseData({
      title: course.title,
      description: course.description,
      capacity: course.capacity,
      instructor: course.instructor,
    });
    setImageFile(null);
    setShowForm(true);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-warning fw-bold">📚 Manage Courses</h2>
        <button
          className="btn btn-primary px-4 fw-semibold"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "➕ Add Course"}
        </button>
      </div>

      {/* ✅ Add/Edit Form */}
      {showForm && (
        <div className="card shadow-lg border-0 mb-5 p-4">
          <h4 className="fw-bold mb-3 text-dark">
            {isEditing ? "🖋 Edit Course" : "➕ Add New Course"}
          </h4>

          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Course Title</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={courseData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Instructor</label>
              <input
                type="text"
                name="instructor"
                className="form-control"
                value={courseData.instructor}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                className="form-control"
                rows="3"
                value={courseData.description}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <div className="col-md-4">
              <label className="form-label">Capacity</label>
              <input
                type="number"
                name="capacity"
                className="form-control"
                value={courseData.capacity}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-8">
              <label className="form-label">Upload Image</label>
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={handleFileChange}
              />
            </div>

            <div className="col-12 text-end">
              <button type="submit" className="btn btn-success fw-semibold px-4">
                {isEditing ? "✅ Update Course" : "➕ Create Course"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ Course List */}
      {courses.length === 0 ? (
        <p className="text-center text-muted mt-4">No courses available yet.</p>
      ) : (
        <div className="row g-4">
          {courses.map((course) => (
            <div key={course.id} className="col-md-4 col-lg-3 d-flex">
              <div className="card shadow-sm border-0 h-100 w-100 position-relative">
                {course.imagePath ? (
                  <img
                    src={getImageUrl(course.imagePath)}
                    alt={course.title}
                    className="card-img-top"
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      borderTopLeftRadius: "8px",
                      borderTopRightRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/300x200?text=No+Image";
                    }}
                  />
                ) : (
                  <div
                    className="d-flex align-items-center justify-content-center bg-secondary text-white"
                    style={{
                      height: "200px",
                      borderRadius: "8px 8px 0 0",
                    }}
                  >
                    No Image
                  </div>
                )}

                <div className="card-body bg-light d-flex flex-column">
                  <h5 className="card-title text-dark fw-bold">
                    {course.title}
                  </h5>
                  <p className="text-muted small flex-grow-1">
                    {course.description?.length > 100
                      ? `${course.description.substring(0, 100)}...`
                      : course.description}
                  </p>
                  <p className="mb-1">
                    <strong>Instructor:</strong> {course.instructor}
                  </p>
                  <p className="mb-1">
                    <strong>Capacity:</strong> {course.capacity}
                  </p>
                  <p className="mb-1">
                    <strong>Enrolled:</strong> {course.enrolledCount}
                  </p>
                </div>

                <div className="card-footer bg-dark d-flex justify-content-between align-items-center">
                  <span className="badge bg-warning text-dark px-3 py-2">
                    #{course.id}
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => handleEdit(course)}
                    >
                      🖋 Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(course.id)}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AllCourses;
