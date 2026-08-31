import React from "react";
import Link from "next/link";
import "./style.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Contact Us */}
        <div className="footer-column">
          <h3>Contact Us</h3>

          <p>10:00am – 10:00pm</p>
          <p>01630-125272, 01763-235959</p>
          <p>Damurhuda, Chuadanga</p>
          <p>support@learningcave.com.bd</p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Quick Links</h3>

          <Link href="#">All Services</Link>
          <Link href="#">Tips and Tricks</Link>
          <Link href="#">FAQs</Link>
        </div>

        {/* Policies */}
        <div className="footer-column">
          <h3>Policies</h3>

          <Link href="#">Refund & Exchange Policy</Link>
          <Link href="#">Payment & Pricing</Link>
          <Link href="#">Privacy Policy</Link>
          <Link href="#">Terms & Conditions</Link>
          <Link href="#">Order & Cancellation</Link>
        </div>

        {/* Information */}
        <div className="footer-column">
          <h3>Information</h3>

          <Link href="#">About Us</Link>
          <Link href="#">Payment Info</Link>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">© 2026 Learning Cave</div>

      {/* Floating Chat */}
      <button className="footer-chat" aria-label="Chat">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 11.5C20 16.1944 15.9706 20 11 20C9.56174 20 8.20864 19.6854 7.01391 19.1228L3.5 20L4.51745 16.9364C3.55955 15.4651 3 13.7356 3 11.5C3 6.80558 7.02944 3 12 3C16.9706 3 20 6.80558 20 11.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </footer>
  );
}
