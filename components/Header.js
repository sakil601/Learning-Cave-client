"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { IoMdMenu } from "react-icons/io";
import { FaWindowClose } from "react-icons/fa";

function Icon({ children, className = "" }) {
  return <span className={`icon ${className}`}>{children}</span>;
}

export default function Header() {
  const [data, setData] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetch("/api/site")
      .then((r) => r.json())
      .then((x) => setData(x.data))
      .catch(() => setData({ brand: {} }));
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const brand = data?.brand || {};
  const logo = brand.logo || "/assets/logo.png";
  const whatsapp = brand.whatsapp
    ? `https://wa.me/${String(brand.whatsapp).replace(/\D/g, "")}`
    : "#";

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      <header>
        <div className="navwrap">
          <button
            className="hamburger"
            type="button"
            aria-label="Open menu"
            aria-expanded={drawerOpen}
            onClick={() => setDrawerOpen((v) => !v)}
          >
            <IoMdMenu size={32} />
          </button>

          <Link className="brandlink" href="/" onClick={closeDrawer}>
            <img
              className="logo"
              src={logo}
              alt={brand.name || "Learning Cave"}
            />
          </Link>

          <div className="header-search">
            <div className="searchbox">
              <input placeholder="Search..." autoComplete="off" />
              <button type="button" className="search-btn" aria-label="Search">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle
                    cx="10.8"
                    cy="10.8"
                    r="6.8"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.9"
                  />
                  <path
                    d="m16 16 5 5"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1.9"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="nav-actions">
            <a
              className="icon wa"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              aria-label="Chat on WhatsApp"
            >
              <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
                <path d="M16.04 3C9.13 3 3.53 8.6 3.53 15.51c0 2.73.88 5.26 2.38 7.32L4 29l6.35-1.86a12.4 12.4 0 0 0 5.69 1.38h.01c6.91 0 12.51-5.6 12.51-12.51C28.56 8.6 22.96 3 16.04 3zm7.35 17.68c-.31.87-1.53 1.6-2.5 1.8-.66.14-1.53.25-4.46-.96-3.74-1.55-6.15-5.34-6.34-5.59-.18-.25-1.52-2.02-1.52-3.86 0-1.84.96-2.74 1.31-3.11.31-.34.68-.42.9-.42h.65c.21 0 .5-.04.77.6.31.75 1.05 2.59 1.14 2.78.09.19.15.41.03.66-.12.25-.18.4-.36.61-.18.21-.38.47-.54.63-.18.18-.37.37-.16.73.21.36.94 1.55 2.02 2.5 1.39 1.24 2.56 1.63 2.93 1.81.37.18.58.15.79-.09.21-.24.9-1.05 1.14-1.41.24-.36.47-.3.79-.18.31.12 2.01.95 2.35 1.12.34.18.57.27.65.42.09.15.09.86-.22 1.73z" />
              </svg>
            </a>
            <Link className="icon cart" href="/checkout" aria-label="Cart">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="9.5" cy="19" r="1.4" fill="currentColor" />
                <circle cx="18" cy="19" r="1.4" fill="currentColor" />
              </svg>
            </Link>
          </div>

          <Link className="btn lc-header-signin" href="/admin/login">
            Sign Up / Login
          </Link>
        </div>
      </header>

      <div
        className={`lc-drawer-backdrop${drawerOpen ? " open" : ""}`}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      <aside
        className={`mobile-menu${drawerOpen ? " open" : ""}`}
        role="dialog"
        aria-label="Menu"
        aria-hidden={!drawerOpen}
      >
        <div className="lc-drawer-head">
          <Link href="/" onClick={closeDrawer}>
            <img
              className="lc-drawer-logo"
              src={logo}
              alt={brand.name || "Learning Cave"}
            />
          </Link>
          <button
            className="lc-drawer-close"
            type="button"
            onClick={closeDrawer}
            aria-label="Close menu"
          >
            <FaWindowClose size={32} />
          </button>
        </div>

        <nav className="lc-drawer-nav">
          <Link className="lc-drawer-link" href="/" onClick={closeDrawer}>
            Home
          </Link>

          <details className="lc-drawer-section">
            <summary>
              <span>Courses</span>
              <em>⌄</em>
            </summary>
            <div className="lc-drawer-panel">
              <Link
                className="lc-drawer-sub"
                href="/courses-excel"
                onClick={closeDrawer}
              >
                Microsoft Excel <em>(4)</em>
              </Link>
              <Link
                className="lc-drawer-sub"
                href="/courses-word"
                onClick={closeDrawer}
              >
                Microsoft Word <em>(2)</em>
              </Link>
              <Link
                className="lc-drawer-sub"
                href="/courses-power-query"
                onClick={closeDrawer}
              >
                Power Query <em>(2)</em>
              </Link>
            </div>
          </details>

          <details className="lc-drawer-section">
            <summary>
              <span>E-Book</span>
              <em>⌄</em>
            </summary>
            <div className="lc-drawer-panel">
              <Link
                className="lc-drawer-sub"
                href="/ebooks-featured"
                onClick={closeDrawer}
              >
                Featured <em>(4)</em>
              </Link>
              <Link
                className="lc-drawer-sub"
                href="/ebooks-new-arrivals"
                onClick={closeDrawer}
              >
                New Arrivals <em>(2)</em>
              </Link>
            </div>
          </details>

          <details className="lc-drawer-section">
            <summary>
              <span>Digital Product</span>
              <em>⌄</em>
            </summary>
            <div className="lc-drawer-panel">
              <Link
                className="lc-drawer-sub"
                href="/digital-products-templates"
                onClick={closeDrawer}
              >
                Templates <em>(2)</em>
              </Link>
              <Link
                className="lc-drawer-sub"
                href="/digital-products-toolkits"
                onClick={closeDrawer}
              >
                Toolkits <em>(2)</em>
              </Link>
            </div>
          </details>

          <details className="lc-drawer-section">
            <summary>
              <span>Tips and Tricks</span>
              <em>⌄</em>
            </summary>
            <div className="lc-drawer-panel">
              <Link
                className="lc-drawer-sub"
                href="/tips-microsoft-office"
                onClick={closeDrawer}
              >
                Microsoft Office <em>(4)</em>
              </Link>
              <Link
                className="lc-drawer-sub"
                href="/tips-power-tools"
                onClick={closeDrawer}
              >
                Power Tools <em>(1)</em>
              </Link>
            </div>
          </details>

          <Link
            className="lc-drawer-link"
            href="/about-us"
            onClick={closeDrawer}
          >
            About
          </Link>
        </nav>

        <Link
          className="lc-drawer-signin"
          href="/admin/login"
          onClick={closeDrawer}
        >
          Sign Up / Login <span>→</span>
        </Link>
      </aside>
    </>
  );
}
