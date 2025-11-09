import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { Modal, Button, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = sessionStorage.getItem("token");

  // ✅ Fetch all users
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("❌ Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ✅ Fetch a specific user for the modal
  const fetchUserById = async (id) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/users/id/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedUser(res.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("❌ Failed to fetch user details");
    }
  };

  // ✅ Delete user
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      const res = await axios.delete(
        `http://localhost:8080/api/users/${deleteTarget.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(
        res.data.message ||
          `🗑️ User "${deleteTarget.username}" deleted successfully!`
      );

      // Remove from local list
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));

      // Reset modals
      setDeleteTarget(null);
      if (selectedUser && selectedUser.id === deleteTarget.id)
        setSelectedUser(null);
    } catch (error) {
      console.error("Error deleting user:", error);

      const msg =
        error.response?.data?.error ||
        error.response?.data ||
        error.message ||
        "Failed to delete user";

      if (msg.includes("Admin accounts cannot be deleted")) {
        toast.warning("⚠️ You cannot delete admin accounts!");
      } else {
        toast.error("❌ " + msg);
      }

      setDeleteTarget(null);
    }
  };

  // ✅ Loader screen
  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-muted">
        <Spinner animation="border" variant="warning" />
        <p className="mt-3 fw-semibold">Loading users...</p>
      </div>
    );
  }

  // ✅ Render main UI
  return (
    <div className="container py-5">
      {/* Toast Notifications */}
      <ToastContainer position="top-center" autoClose={3000} />

      <h2 className="text-center text-warning fw-bold mb-5">
        👥 User Management
      </h2>

      {users.length === 0 ? (
        <p className="text-center text-muted">No users found.</p>
      ) : (
        <div className="row g-4">
          {users.map((user) => (
            <div key={user.id} className="col-md-4 col-lg-3 d-flex">
              <div
                className="card shadow-sm border-0 h-100 w-100"
                style={{ borderRadius: "15px" }}
              >
                <div className="card-body bg-light text-center d-flex flex-column">
                  <h5 className="fw-bold text-dark mb-1">{user.username}</h5>
                  <p className="text-muted small mb-1">{user.email}</p>
                  <span className="badge bg-warning text-dark mb-3">
                    {user.role}
                  </span>

                  {/* ✅ Action Buttons */}
                  <div className="mt-auto d-flex justify-content-center gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => fetchUserById(user.id)}
                    >
                      👁 View
                    </Button>

                    {user.role !== "ADMIN" ? (
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => setDeleteTarget(user)}
                      >
                        🗑 Delete
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" disabled>
                        🔒 Admin
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ User Details Modal */}
      <Modal
        show={!!selectedUser}
        onHide={() => setSelectedUser(null)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-warning fw-bold">
            User Details
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <p>
                <strong>ID:</strong> {selectedUser.id}
              </p>
              <p>
                <strong>Username:</strong> {selectedUser.username}
              </p>
              <p>
                <strong>Email:</strong> {selectedUser.email}
              </p>
              <p>
                <strong>Role:</strong>{" "}
                <span className="badge bg-primary">{selectedUser.role}</span>
              </p>
              <p>
                <strong>Max Courses:</strong>{" "}
                {selectedUser.max_courses ?? selectedUser.maxCourses ?? "Not set"}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setSelectedUser(null)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Delete Confirmation Modal */}
      <Modal
        show={!!deleteTarget}
        onHide={() => setDeleteTarget(null)}
        centered
        backdrop="static"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger fw-bold">
            Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {deleteTarget && (
            <p className="fw-semibold text-dark">
              Are you sure you want to delete{" "}
              <strong>{deleteTarget.username}</strong>?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Yes, Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* ✅ Custom CSS */}
      <style>
        {`
          .card {
            transition: all 0.3s ease-in-out;
          }
          .card:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          }
          .card-body .btn {
            min-width: 90px;
          }
        `}
      </style>
    </div>
  );
};

export default UserList;
