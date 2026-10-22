"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { productHref, productTypeLabel } from "@/lib/routes";

export default function SearchOverlay({ open, onClose }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (query.trim().length < 2) {
      setItems([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const result = await apiFetch(`/products?search=${encodeURIComponent(query.trim())}&limit=10`, {
          skipRefresh: true,
        });
        setItems(result?.data || []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, open]);

  if (!open) return null;

  return (
    <div className="lc-search-overlay open" role="dialog" aria-label="Search">
      <div className="lc-search-overlay-backdrop" onClick={onClose} />
      <div className="lc-search-overlay-card">
        <div className="lc-search-overlay-head">
          <button type="button" onClick={onClose} aria-label="Close search">
            <svg viewBox="0 0 24 24"><path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className="searchbox">
            <input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search courses, e-books, products..." autoComplete="off" />
            <button type="button" className="search-btn" aria-label="Search">
              <svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="#fff" strokeWidth="1.9"/><path d="m16 16 5 5" fill="none" stroke="#fff" strokeWidth="1.9" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        <div className="lc-search-overlay-body">
          {loading && <p>Searching...</p>}
          {!loading && query.trim().length < 2 && (
            <div className="lc-search-empty">
              <svg viewBox="0 0 24 24"><circle cx="10.8" cy="10.8" r="7.8" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="m17 17 5.5 5.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
              <p>Search for courses, e-books & products</p>
            </div>
          )}
          {!loading && query.trim().length >= 2 && !items.length && <p>No products found.</p>}
          {items.map((product) => (
            <Link key={product._id} className="search-result-item" href={productHref(product)} onClick={onClose}>
              <strong>{product.title}</strong>
              <small>{productTypeLabel(product.type)}</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
