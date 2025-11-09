import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserRole, saveAuthData } from "../Auth/AuthService";

const AdminLogin = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // Call backend API
      const response = await axios.post("http://localhost:8080/api/users/login", data);
      console.log(response.data);
      if (response.status === 200) {
          saveAuthData(response.data);
        

        if (getUserRole() === "ADMIN") {
          toast.success("✅ Admin login successful!");
          navigate("/admin-dashboard");
        } else {
          toast.error("🚫 Access denied! You are not an admin.");
        }
      }
    } catch (error) {
      console.error("❌ Admin Login Error:", error);
      const msg =
        error.response?.status === 401
          ? "Invalid username or password!"
          : "Server error. Please try again later.";
      toast.error(msg);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card shadow p-4"
        style={{ width: "400px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4 text-warning fw-bold">Admin Login</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              {...register("username", { required: true })}
              placeholder="Enter admin username"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              {...register("password", { required: true })}
              placeholder="Enter password"
            />
          </div>

          <button type="submit" className="btn btn-warning w-100 fw-semibold">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
