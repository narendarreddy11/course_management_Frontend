import React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import NavBar from "./NavBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function RootLayout() {
  return (
    <div>
      {/* 🌐 Navbar always visible */}
      <NavBar />

      {/* 📦 Main page outlet */}
      <div style={{ minHeight: "80vh" }}>
        <Outlet />
      </div>

      {/* 📘 Footer */}
      <Footer />

      {/* ✅ Global Toast Notification container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}

export default RootLayout;
