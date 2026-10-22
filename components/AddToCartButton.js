"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AddToCartButton({ productId, batchId, disabled = false, label = "Enroll Now" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function add() {
    if (disabled || busy) return;
    setBusy(true);
    setError("");
    try {
      await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId, ...(batchId ? { batchId } : {}) }),
      });
      if (typeof window !== "undefined") window.dispatchEvent(new Event("lc-cart-changed"));
      router.push("/checkout");
    } catch (err) {
      if (err.status === 401) {
        const next = typeof window !== "undefined" ? window.location.pathname : "/";
        router.push(`/login?next=${encodeURIComponent(next)}`);
      } else if (err.code === "PRODUCT_ALREADY_IN_CART") {
        router.push("/checkout");
      } else {
        setError(err.message);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button type="button" className="btn" onClick={add} disabled={disabled || busy}>{busy ? "Please wait..." : label}</button>
      {error && <small style={{ display: "block", color: "#b42318", marginTop: 8 }}>{error}</small>}
    </>
  );
}
