import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function Navbar() {
  const navigate = useNavigate();

  // Get user details from sessionStorage
  const token = sessionStorage.getItem("token");
  const role = sessionStorage.getItem("role");
  const username = sessionStorage.getItem("username");

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
      <div className="container">
        {/* Brand */}
        <NavLink className="navbar-brand fw-bold text-warning" to="/">
          CourseApp
        </NavLink>

        {/* Mobile Menu Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Nav Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {/* 👥 GUEST or STUDENT NAV */}
            {!token && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/home"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    Home
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/courses"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    Courses
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/admin-login"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    Admin
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    Login
                  </NavLink>
                </li>
              </>
            )}

            {/* 👨‍🎓 STUDENT NAV */}
            {token && role === "USER" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/student-dashboard"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/courses"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    Courses
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/userenrolled"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    My Enrollments
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    {username}
                  </NavLink>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-outline-warning ms-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}

            {/* 🛠️ ADMIN NAV */}
            {token && role === "ADMIN" && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/admin-dashboard"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    Dashboard
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/admin/users"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    Users List
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/admin/courses"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    All Courses
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    to="/admin/enrollments"
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active text-warning fw-bold" : ""}`
                    }
                  >
                    Enrollments
                  </NavLink>
                </li>

                <li className="nav-item">
                  <button
                    className="btn btn-outline-warning ms-3"
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
