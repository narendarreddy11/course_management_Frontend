import React, { useEffect, useState } from "react";
import api from "../Auth/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [groupedData, setGroupedData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const res = await api.get("admin/all");
      setEnrollments(res.data);
  console.log(res.data);
      const grouped = res.data.reduce((acc, e) => {
        if (!acc[e.courseTitle]) acc[e.courseTitle] = [];
        acc[e.courseTitle].push(e);
        return acc;
      }, {});
      setGroupedData(grouped);
    } catch (err) {
      console.error("Error fetching enrollments", err);
      toast.error("Failed to load enrollments");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (studentId, courseId) => {
    if (!window.confirm("Are you sure you want to cancel this enrollment?")) return;

    try {
      await api.delete(`/enrollments/cancel/${studentId}/${courseId}`);
      toast.success("Enrollment cancelled");
      fetchEnrollments();
    } catch (err) {
      console.error("Error cancelling enrollment", err);
      toast.error("Failed to cancel enrollment");
    }
  };

  if (loading) return <div className="p-4 text-center text-lg">Loading...</div>;

  return (
    <div className="p-6">
      <ToastContainer />
      <h2 className="text-2xl font-semibold mb-4 text-center">📚 All Enrollments</h2>

      {Object.keys(groupedData).length === 0 ? (
        <p className="text-gray-500 text-center">No enrollments found.</p>
      ) : (
        Object.entries(groupedData)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([courseTitle, enrolls]) => (
            <div
              key={courseTitle}
              className="bg-white shadow-md rounded-2xl p-5 mb-6 border border-gray-100"
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-blue-600">{courseTitle}</h3>
                <span className="text-sm text-gray-500">
                  {enrolls.length} student(s)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Student Name</th>
                      <th className="p-2 text-left">Student ID</th>
                      <th className="p-2 text-left">Enrolled At</th>
                      <th className="p-2 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrolls.map((e) => (
                      <tr
                        key={e.id}
                        className="border-t hover:bg-gray-50 transition-all"
                      >
                        <td className="p-2">{e.studentName}</td>
                        <td className="p-2">{e.studentId}</td>
                        <td className="p-2">{e.enrolledAt}</td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => handleCancel(e.studentId, e.courseId)}
                            className="px-3 py-1 bg-light text-danger rounded hover:bg-red-600 transition"
                          >
                            Cancel
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
      )}
    </div>
  );
}

export default Enrollments;
