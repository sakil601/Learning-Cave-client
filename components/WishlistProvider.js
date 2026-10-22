"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import { useAuth } from "./AuthProvider";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const [ids, setIds] = useState(() => new Set());
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setIds(new Set());
      return;
    }
    setLoading(true);
    try {
      const result = await apiFetch("/wishlist");
      setIds(new Set((result?.data || []).map((item) => String(item.product?._id || item.product))));
    } catch {
      setIds(new Set());
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  const add = useCallback((productId) => {
    setIds((prev) => {
      const next = new Set(prev);
      next.add(String(productId));
      return next;
    });
  }, []);

  const remove = useCallback((productId) => {
    setIds((prev) => {
      const next = new Set(prev);
      next.delete(String(productId));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ ids, loading, refresh, add, remove }), [ids, loading, refresh, add, remove]);
  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const value = useContext(WishlistContext);
  if (!value) throw new Error("useWishlist must be used inside WishlistProvider");
  return value;
}
