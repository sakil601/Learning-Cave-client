"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "./ThemeToggle";
import SearchOverlay from "./SearchOverlay";
import { useAuth } from "./AuthProvider";
import { apiFetch } from "@/lib/api";
import { useWishlist } from "./WishlistProvider";

export default function Header() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { user, loading, logout } = useAuth();
  const { ids: wishlistIds } = useWishlist();
  const router = useRouter();

  useEffect(() => {
    document.body.style.overflow = drawerOpen || searchOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen, searchOpen]);

  useEffect(() => {
    if (!user) {
      setCartCount(0);
      return;
    }

    const loadCartCount = () => {
      apiFetch("/cart")
        .then((x) => setCartCount(x?.data?.items?.length || 0))
        .catch(() => setCartCount(0));
    };

    loadCartCount();
    window.addEventListener("lc-cart-changed", loadCartCount);
    return () => window.removeEventListener("lc-cart-changed", loadCartCount);
  }, [user]);

  async function handleLogout() {
    await logout();
    setProfileOpen(false);
    setDrawerOpen(false);
    router.push("/");
    router.refresh();
  }

  return (
    <header>
      <div className="navwrap">
        <button className="hamburger" type="button" aria-label="Open menu" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>
          <svg className="header-icon hamburger-icon" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round"/></svg>
        </button>

        <Link className="brandlink" href="/">
          <span className="logo-chip"><img className="logo" src="/assets/logo.png" alt="Learning Cave" /></span>
        </Link>

        <div className="header-search">
          <div className="searchbox">
            <input placeholder="Search..." autoComplete="off" onFocus={() => setSearchOpen(true)} readOnly />
            <button type="button" className="search-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="#fff" strokeWidth="1.9"/><path d="m16 16 5 5" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          <button type="button" className="icon search-toggle" aria-label="Search" onClick={() => setSearchOpen(true)}>
            <svg className="header-icon" viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" strokeWidth="1.9"/><path d="m16 16 5 5" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
          </button>

          {user && (
            <Link className="icon header-wishlist" href="/wishlist" aria-label="Wishlist">
              <svg className="header-icon" viewBox="0 0 24 24"><path d="M20.8 8.6c0-2.6-2.1-4.6-4.7-4.6-1.6 0-3.1.8-4.1 2.1-1-1.3-2.5-2.1-4.1-2.1-2.6 0-4.7 2-4.7 4.6 0 6.3 8.8 11 8.8 11s8.8-4.7 8.8-11z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>
              {wishlistIds.size > 0 && <span className="cart-badge">{wishlistIds.size}</span>}
            </Link>
          )}

          <Link className="icon cart" href={user ? "/checkout" : "/login?next=/checkout"} aria-label="Cart">
            <svg className="header-icon" viewBox="0 0 24 24"><path d="M3 4h2l2.2 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L21 7H6" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9.5" cy="19" r="1.4" fill="currentColor"/><circle cx="18" cy="19" r="1.4" fill="currentColor"/></svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {!loading && user && (
            <div className="profile-wrap">
              <button type="button" className="icon profile-btn" aria-label="Account" aria-expanded={profileOpen} onClick={() => setProfileOpen((v) => !v)}>
                <svg className="header-icon" viewBox="0 0 24 24"><circle cx="12" cy="8.2" r="3.6" fill="none" stroke="currentColor" strokeWidth="1.9"/><path d="M4.5 20c1.4-3.8 4.4-5.8 7.5-5.8s6.1 2 7.5 5.8" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"/></svg>
              </button>
              <div className={`profile-drop${profileOpen ? " open" : ""}`}>
                <div className="profile-drop-head"><span className="profile-avatar">{(user.name || "U").slice(0,2).toUpperCase()}</span><div><strong>{user.name}</strong><small>{user.email}</small></div></div>
                <Link href="/profile" onClick={() => setProfileOpen(false)}>My Profile</Link>
                <Link href="/dashboard" onClick={() => setProfileOpen(false)}>My Purchase</Link>
                <Link href="/wishlist" onClick={() => setProfileOpen(false)}>Wishlist</Link>
                {user.role === "admin" && <Link href="/admin" onClick={() => setProfileOpen(false)}>Admin</Link>}
                <button type="button" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          )}
        </div>

        {!loading && !user && <Link className="btn lc-header-signin" href="/login">Sign Up / Login</Link>}
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      <div className={`lc-drawer-backdrop${drawerOpen ? " open" : ""}`} onClick={() => setDrawerOpen(false)} />
      <div className={`mobile-menu${drawerOpen ? " open" : ""}`} role="dialog" aria-label="Menu">
        <div className="lc-drawer-head">
          <span className="logo-chip"><img className="lc-drawer-logo" src="/assets/logo.png" alt="Learning Cave" /></span>
          <button className="lc-drawer-close" onClick={() => setDrawerOpen(false)} aria-label="Close menu">✕</button>
        </div>
        <nav className="lc-drawer-nav">
          <Link className="lc-drawer-link" href="/" onClick={() => setDrawerOpen(false)}>Home</Link>
          <Link className="lc-drawer-link" href="/courses" onClick={() => setDrawerOpen(false)}>Courses</Link>
          <Link className="lc-drawer-link" href="/ebooks" onClick={() => setDrawerOpen(false)}>E-Book</Link>
          <Link className="lc-drawer-link" href="/digital-products" onClick={() => setDrawerOpen(false)}>Digital Product</Link>
          <Link className="lc-drawer-link" href="/bundles" onClick={() => setDrawerOpen(false)}>Course Bundle</Link>
          <Link className="lc-drawer-link" href="/tips" onClick={() => setDrawerOpen(false)}>Tips and Tricks</Link>
          <Link className="lc-drawer-link" href="/about-us" onClick={() => setDrawerOpen(false)}>About Us</Link>
          {user && <Link className="lc-drawer-link" href="/dashboard" onClick={() => setDrawerOpen(false)}>My Purchase</Link>}
        </nav>
        {!user && <Link className="lc-drawer-signin" href="/login" onClick={() => setDrawerOpen(false)}>Sign Up / Login <span>→</span></Link>}
      </div>
    </header>
  );
}
