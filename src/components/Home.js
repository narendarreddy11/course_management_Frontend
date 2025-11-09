import React from "react";
// 🖼️ Import your images here
import heroImg from '../assets/hero.jpg';
import softwareImg from '../assets/software.png';
import dataScienceImg from '../assets/datascience.png';
import cloudImg from "../assets/cloud.png";
import trendingImg from "../assets/trending.png";

function Home() {
  return (
    <div>
      {/* ===== Hero Section ===== */}
      <section className="text-light text-center py-5" style={{ position: "relative" }}>
        <img
          src={heroImg}
          alt="Hero"
          className="img-fluid w-100"
          style={{ height: "70vh", objectFit: "cover", filter: "brightness(90%)" }}
        />
        <div
          className="position-absolute top-50 start-50 translate-middle text-center"
          style={{ zIndex: 2 }}
        >
          <h1 className="display-4 fw-bold text-warning">
            Welcome to CourseApp Enterprise Edition
          </h1>
          <p className="lead mt-3 text-light">
            Empowering learners and administrators with seamless course management,
            advanced analytics, and modern technology.
          </p>
          <a href="/courses" className="btn btn-warning btn-lg mt-3 shadow">
            Explore Courses
          </a>
        </div>
      </section>

      {/* ===== Introduction ===== */}
      <section className="py-5 bg-light">
        <div className="container">
          <h2 className="fw-bold text-center mb-4 text-dark">
            About Course Management System
          </h2>
          <p className="text-muted fs-5 text-center">
            CourseApp Enterprise Edition is a scalable, AI-powered learning platform designed for
            universities, corporates, and professionals. It streamlines course administration,
            enhances student engagement, and provides insightful analytics for growth.
          </p>
        </div>
      </section>

      {/* ===== Course Categories ===== */}
      <section className="py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-5 text-dark">
            Our Popular Course Categories
          </h2>
          <div className="row text-center g-4">
            {/* Software Development */}
            <div className="col-md-4">
              <div className="card h-100 shadow border-0">
                <img src={softwareImg} className="card-img-top" alt="Software Development" />
                <div className="card-body">
                  <h4 className="card-title text-warning">Software Development</h4>
                  <p className="card-text text-muted">
                    Master full-stack development with Spring Boot, React, and modern DevOps
                    workflows. Build real-world enterprise-grade applications.
                  </p>
                </div>
              </div>
            </div>

            {/* Data Science & AI */}
            <div className="col-md-4">
              <div className="card h-100 shadow border-0">
                <img src={dataScienceImg} className="card-img-top" alt="Data Science" />
                <div className="card-body">
                  <h4 className="card-title text-warning">Data Science & AI</h4>
                  <p className="card-text text-muted">
                    Learn Machine Learning, Python, and Artificial Intelligence to solve
                    real-world problems using predictive analytics and data visualization.
                  </p>
                </div>
              </div>
            </div>

            {/* Cloud Computing */}
            <div className="col-md-4">
              <div className="card h-100 shadow border-0">
                <img src={cloudImg} className="card-img-top" alt="Cloud Computing" />
                <div className="card-body">
                  <h4 className="card-title text-warning">Cloud & DevOps</h4>
                  <p className="card-text text-muted">
                    Deploy and scale using AWS, Azure, Docker, Kubernetes, and CI/CD pipelines —
                    essential for enterprise infrastructure.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Trending Technologies ===== */}
      <section className="bg-light py-5">
        <div className="container">
          <h2 className="fw-bold text-center mb-5 text-dark">Trending Technologies in 2025</h2>
          <div className="row align-items-center">
            <div className="col-md-6 mb-4 mb-md-0">
              <img
                src={trendingImg}
                alt="Trending Technologies"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-md-6">
              <ul className="list-group list-group-flush fs-5">
                <li className="list-group-item">🚀 Artificial Intelligence & Generative AI</li>
                <li className="list-group-item">☁️ Cloud-Native Applications & Edge Computing</li>
                <li className="list-group-item">🔐 Cybersecurity & Zero-Trust Architecture</li>
                <li className="list-group-item">🌐 Web3, Blockchain, and Smart Contracts</li>
                <li className="list-group-item">📱 Cross-Platform App Development</li>
                <li className="list-group-item">🤖 Automation, RPA & MLOps</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Call to Action ===== */}
      <section className="py-5 text-center bg-dark text-light">
        <div className="container">
          <h2 className="fw-bold text-warning mb-3">Start Learning with Confidence</h2>
          <p className="lead mb-4">
            Join a global network of professionals mastering the latest technologies.
            Accelerate your growth with CourseApp Enterprise.
          </p>
          <a href="/login" className="btn btn-warning btn-lg shadow">
            Get Started Today
          </a>
        </div>
      </section>
    </div>
  );
}

export default Home;
