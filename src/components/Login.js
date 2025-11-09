import React from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { saveAuthData } from "../Auth/AuthService";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const navigate = useNavigate();

  // 🔐 Handle Login Submit
  async function onSubmit(data) {
    try {
      console.log("Login attempt:", data);

      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      // ❌ Handle API errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Invalid login credentials");
      }

      // ✅ Successful login
      const result = await response.json();
      console.log("Login successful:", result);

      // ✅ Store token and user info centrally
      saveAuthData(result);

      // 🔁 Redirect based on user role
      if (result.role === "ADMIN") {
        navigate("/admin-dashboard");
      } else if (result.role === "USER") {
        navigate("/student-dashboard");
      } 

    } catch (error) {
      console.error("Login error:", error);
      alert("❌ Invalid username or password. Please try again.");
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 border-0"
        style={{ width: "400px", borderRadius: "15px" }}
      >
        <h3 className="text-center mb-4 text-primary fw-bold">
          Login to Your Account
        </h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Username */}
          <div className="mb-3">
            <label htmlFor="username" className="form-label fw-semibold">
              Username
            </label>
            <input
              id="username"
              type="text"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              placeholder="Enter your username"
              {...register("username", {
                required: "Username is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
              })}
            />
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="d-grid">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </button>
          </div>

          {/* Footer */}
          <p className="text-muted mt-3 text-center">
            Don’t have an account?{" "}
            <Link to="/register" className="text-decoration-none fw-semibold">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
