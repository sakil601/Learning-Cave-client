"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import "./style.css";

const slides = [
  {
    title: "Microsoft Excel & Advanced Excel Skills",
    subtitle: "Practical courses • Learning Cave",
  },
  {
    title: "Microsoft Word & PowerPoint Skills",
    subtitle: "Learn practical office skills • Learning Cave",
  },
  {
    title: "Power BI & Data Visualization",
    subtitle: "Build your data skills • Learning Cave",
  },
  {
    title: "Power Query & Data Cleaning",
    subtitle: "Work smarter with your data • Learning Cave",
  },
];

// const courses = [
//   {
//     name: "Microsoft Excel",
//     short: "X",
//     color: "green",
//   },
//   {
//     name: "Microsoft Word",
//     short: "W",
//     color: "blue",
//   },
//   {
//     name: "Power Query",
//     short: "PQ",
//     color: "yellow",
//   },
//   {
//     name: "Power BI",
//     short: "BI",
//     color: "orange",
//   },
//   {
//     name: "PowerPoint",
//     short: "P",
//     color: "red",
//   },
// ];

const categoryColors = {
  excel: {
    bg: "#dff2e5",
    color: "#176d3d",
  },
  word: {
    bg: "#e5effd",
    color: "#245b93",
  },
  "power-query": {
    bg: "#fff0c9",
    color: "#805900",
  },
  "power-bi": {
    bg: "#ffe6cc",
    color: "#b85c00",
  },
  powerpoint: {
    bg: "#fde2e2",
    color: "#c62828",
  },
};

export default function Slider({ data }) {
  const [activeSlide, setActiveSlide] = useState(0);
  // console.log(data);

  const categories =
    data?.filter((category) => category.active !== false) || [];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="bg-white">
      {/* =========================
          TOP SECTION
      ========================== */}
      <section className="bg-white py-6">
        <div className="lc-container">
          <div className="top-content">
            {/* LEFT VIDEO */}
            <div className="video-box">
              <video
                className="w-full h-full "
                autoPlay
                loop
                playsInline
                controls={true}
              >
                <source src="/assets/videos/welcome-1.mp4" type="video/mp4" />
              </video>

              {/* Video Overlay */}
            </div>

            {/* RIGHT SLIDER */}
            <div className="hero-slider">
              <div
                className="slider-track"
                style={{
                  transform: `translateX(-${activeSlide * 100}%)`,
                }}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="slider-slide">
                    {/* Decorative lines */}
                    <div className="diagonal-lines"></div>

                    <div className="slider-content">
                      <h1>{slide.title}</h1>

                      <p>{slide.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dots */}
              <div className="slider-dots">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`slider-dot ${
                      activeSlide === index ? "active" : ""
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          LEARNING SECTION
      ========================== */}
      <section className="learning-section">
        <div className="lc-container">
          {/* Small heading */}
          <div className="learning-label">START YOUR LEARNING JOURNEY</div>

          {/* Main Heading */}
          <h2 className="learning-title">
            What do you want to <span>learn</span> today?
          </h2>

          {/* Description */}
          <p className="learning-description">
            Choose a topic and start your learning journey with Learning Cave.
          </p>

          {/* COURSE CATEGORY CARDS */}
          <div className="course-grid">
            {categories.map((category) => {
              const colors = categoryColors[category.slug] || {
                bg: "#eef2f5",
                color: "#173650",
              };

              return (
                <Link
                  key={category.slug}
                  href={`/courses/${category.slug}`}
                  className="course-card"
                >
                  <div
                    className="course-icon"
                    style={{
                      backgroundColor: colors.bg,
                      color: colors.color,
                    }}
                  >
                    {category.shortName?.charAt(0)}
                  </div>

                  <div className="course-info">
                    <h3>{category.name}</h3>

                    <div
                      className="course-line"
                      style={{
                        backgroundColor: colors.color,
                      }}
                    ></div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* COURSE CARDS
          <div className="course-grid cursor-pointer">
            {courses.map((course) => (
              <div key={course.name} className="course-card">
                <div className={`course-icon ${course.color}`}>
                  {course.short}
                </div>

                <div className="course-info">
                  <h3>{course.name}</h3>

                  <div className={`course-line ${course.color}`}></div>
                </div>
              </div>
            ))}
          </div> */}
        </div>
      </section>
    </main>
  );
}
