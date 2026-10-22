"use client";

export default function FlashMessage({ type = "info", children }) {
  if (!children) return null;
  return <div className={`flash-message ${type}`}>{children}</div>;
}
