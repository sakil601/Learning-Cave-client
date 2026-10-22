"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";

const OwnershipContext = createContext(null);

export function OwnershipProvider({ children }) {
  const { user, loading: authLoading } = useAuth();

  const [loading, setLoading] = useState(false);

  const [recordedCourses, setRecordedCourses] = useState([]);
  const [liveCourses, setLiveCourses] = useState([]);
  const [ebooks, setEbooks] = useState([]);
  const [digitalProducts, setDigitalProducts] = useState([]);
  const [bundles, setBundles] = useState([]);

  const clearOwnership = useCallback(() => {
    setRecordedCourses([]);
    setLiveCourses([]);
    setEbooks([]);
    setDigitalProducts([]);
    setBundles([]);
  }, []);

  const refreshOwnership = useCallback(async () => {
    if (!user) {
      clearOwnership();
      return;
    }

    setLoading(true);

    try {
      const results = await Promise.allSettled([
        apiFetch("/enrollments/me"),
        apiFetch("/live-courses/me"),
        apiFetch("/ebooks/me"),
        apiFetch("/digital-products/me"),
        apiFetch("/bundles/me"),
      ]);

      const [
        recordedResult,
        liveResult,
        ebookResult,
        digitalResult,
        bundleResult,
      ] = results;

      setRecordedCourses(
        recordedResult.status === "fulfilled"
          ? recordedResult.value?.data || []
          : [],
      );

      setLiveCourses(
        liveResult.status === "fulfilled" ? liveResult.value?.data || [] : [],
      );

      setEbooks(
        ebookResult.status === "fulfilled" ? ebookResult.value?.data || [] : [],
      );

      setDigitalProducts(
        digitalResult.status === "fulfilled"
          ? digitalResult.value?.data || []
          : [],
      );

      setBundles(
        bundleResult.status === "fulfilled"
          ? bundleResult.value?.data || []
          : [],
      );
    } finally {
      setLoading(false);
    }
  }, [user, clearOwnership]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      clearOwnership();
      return;
    }

    refreshOwnership();
  }, [authLoading, user, refreshOwnership, clearOwnership]);

  const ownershipMap = useMemo(() => {
    const map = new Map();

    for (const item of recordedCourses) {
      const productId = item?.product?._id;
      const courseId = item?.course?._id;

      if (!productId) continue;

      map.set(String(productId), {
        owned: true,
        type: "recorded_course",
        productId,
        courseId,
        enrollmentId: item?._id,
      });
    }

    for (const item of liveCourses) {
      const productId = item?.product?._id;

      if (!productId) continue;

      map.set(String(productId), {
        owned: true,
        type: "live_course",
        productId,
        batchId: item?.batch?._id,
      });
    }

    for (const item of ebooks) {
      const productId = item?.product?._id;

      if (!productId) continue;

      map.set(String(productId), {
        owned: true,
        type: "ebook",
        productId,
      });
    }

    for (const item of digitalProducts) {
      const productId = item?.product?._id;

      if (!productId) continue;

      map.set(String(productId), {
        owned: true,
        type: "digital_product",
        productId,
      });
    }

    for (const item of bundles) {
      const productId = item?.product?._id;

      if (!productId) continue;

      map.set(String(productId), {
        owned: true,
        type: "bundle",
        productId,
      });
    }

    return map;
  }, [recordedCourses, liveCourses, ebooks, digitalProducts, bundles]);

  const getOwnership = useCallback(
    (productId) => {
      if (!productId) return null;

      return ownershipMap.get(String(productId)) || null;
    },
    [ownershipMap],
  );

  const isOwned = useCallback(
    (productId) => Boolean(getOwnership(productId)),
    [getOwnership],
  );

  const value = useMemo(
    () => ({
      loading,

      recordedCourses,
      liveCourses,
      ebooks,
      digitalProducts,
      bundles,

      getOwnership,
      isOwned,
      refreshOwnership,
    }),
    [
      loading,
      recordedCourses,
      liveCourses,
      ebooks,
      digitalProducts,
      bundles,
      getOwnership,
      isOwned,
      refreshOwnership,
    ],
  );

  return (
    <OwnershipContext.Provider value={value}>
      {children}
    </OwnershipContext.Provider>
  );
}

export function useOwnership() {
  const value = useContext(OwnershipContext);

  if (!value) {
    throw new Error("useOwnership must be used inside OwnershipProvider");
  }

  return value;
}
