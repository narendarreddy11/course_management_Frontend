import React, { useEffect, useState } from "react";
import api from "../Auth/api"; // ✅ axios interceptor instance
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import "react-toastify/dist/ReactToastify.css";

const EnrolledCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const userId = sessionStorage.getItem("userid");

  // ✅ Fetch enrolled courses on mount
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const res = await api.get(`/enrollments/student/${userId}`);
        setEnrollments(res.data);
      } catch (err) {
        console.error("❌ Error fetching enrolled courses:", err);
        toast.error("Failed to fetch enrolled courses");
      }
    };

    fetchEnrolledCourses();
  }, [userId]);

  // 🗑 Cancel Enrollment with SweetAlert2 confirmation
  const handleCancelEnrollment = async (courseId, courseTitle) => {
    Swal.fire({
      title: "Cancel Enrollment?",
      text: `Are you sure you want to cancel "${courseTitle}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, cancel it",
      cancelButtonText: "No, keep it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/enrollments/cancel/${userId}/${courseId}`);
          toast.success(" Enrollment cancelled successfully!");

          // Remove course from list instantly
          setEnrollments((prev) => prev.filter((e) => e.courseId !== courseId));

          Swal.fire({
            title: "Cancelled!",
            text: `"${courseTitle}" has been removed from your enrolled courses.`,
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } catch (err) {
          console.error(" Error cancelling enrollment:", err);
          Swal.fire({
            title: "Error!",
            text: "Failed to cancel enrollment. Try again later.",
            icon: "error",
          });
        }
      }
    });
  };

  return (
    <div className="container py-5 px-4 bg-light min-vh-100">
      <h2 className="text-center text-primary fw-bold mb-4">
        🎓 My Enrolled Courses
      </h2>

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />

      {enrollments.length === 0 ? (
        <div className="text-center text-muted fs-5 mt-5">
          You haven’t enrolled in any courses yet.
        </div>
      ) : (
        <div className="row g-4">
          {enrollments.map((enroll) => (
            <div key={enroll.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div
                className="card border-0 shadow-sm rounded-4 h-100 d-flex flex-column"
                style={{ transition: "transform 0.3s ease" }}
              >
                <div className="card-body d-flex flex-column">
                  <h5 className="fw-bold text-primary mb-2">
                    {enroll.courseTitle}
                  </h5>

                  <p className="text-muted small mb-1">
                    👤 <strong>Student:</strong> {enroll.studentName}
                  </p>

                  <p className="text-muted small mb-3">
                     <strong>Enrolled on:</strong> {enroll.enrolledAt}
                  </p>

                  <button
                    className="btn btn-outline-danger mt-auto fw-semibold"
                    onClick={() =>
                      handleCancelEnrollment(enroll.courseId, enroll.courseTitle)
                    }
                  >
                    Cancel Enrollment
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          .card:hover {
            transform: translateY(-6px);
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
          }
        `}
      </style>
    </div>
  );
};

export default EnrolledCourses;
