import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [serverMessage, setServerMessage] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (data) => {
    setServerMessage(null);
    setIsSuccess(false);

    try {
      const response = await fetch("http://localhost:8080/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const text = await response.text();

      if (response.ok) {
        setIsSuccess(true);
        setServerMessage("✅ Registered successfully! Redirecting to login...");
        reset();
        setTimeout(() => navigate("/login"), 1500);
      } else {
        // Handle backend messages gracefully
        if (text.includes("Username or Email already exists")) {
          setServerMessage("❌ Username or Email already exists. Try another one.");
        } else {
          setServerMessage("⚠️ Something went wrong. Please try again later.");
        }
        setIsSuccess(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setIsSuccess(false);
      setServerMessage("⚠️ Unable to connect to the server. Try again later.");
    }
  };

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg border-0 rounded-4 p-4" style={{ width: "400px" }}>
        <h2 className="text-center mb-4 fw-bold text-primary">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {/* Username */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "At least 3 characters" },
              })}
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email.message}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          {/* Role */}
          <div className="mb-4">
            <label className="form-label fw-semibold">Role</label>
            <select
              className={`form-select ${errors.role ? "is-invalid" : ""}`}
              {...register("role", { required: "Select a role" })}
            >
              <option value="">Select role</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {errors.role && (
              <div className="invalid-feedback">{errors.role.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100 py-2 fw-semibold">
            Register
          </button>

          {/* Server Message */}
          {serverMessage && (
            <div
              className={`mt-3 text-center fw-semibold ${
                isSuccess ? "text-success" : "text-danger"
              }`}
            >
              {serverMessage}
            </div>
          )}

          {/* Footer */}
          <p className="text-center text-muted mt-4 mb-0">
            Already have an account?{" "}
           <Link to="/Login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
