"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useWishlist } from "./WishlistProvider";

export default function WishlistButton({ productId }) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();
  const { ids, add, remove } = useWishlist();
  const active = ids.has(String(productId));

  async function toggle(event) {
    event?.preventDefault?.();
    event?.stopPropagation?.();
    if (busy) return;
    setBusy(true);

    try {
      if (active) {
        await apiFetch(`/wishlist/${productId}`, { method: "DELETE" });
        remove(productId);
      } else {
        await apiFetch("/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId }),
        });
        add(productId);
      }
    } catch (error) {
      if (error.status === 401) {
        const next = typeof window !== "undefined" ? window.location.pathname : "/";
        router.push(`/login?next=${encodeURIComponent(next)}`);
      } else if (error.code === "PRODUCT_ALREADY_IN_WISHLIST") {
        add(productId);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className={`card-love-btn${active ? " loved" : ""}`}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      onClick={toggle}
      disabled={busy}
    >
      <span className="love-icon">
        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.8 8.6c0-2.6-2.1-4.6-4.7-4.6-1.6 0-3.1.8-4.1 2.1-1-1.3-2.5-2.1-4.1-2.1-2.6 0-4.7 2-4.7 4.6 0 6.3 8.8 11 8.8 11s8.8-4.7 8.8-11z"/></svg>
      </span>
    </button>
  );
}
