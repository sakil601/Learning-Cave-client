"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function SecureDownloadButton({ path, fileName = "download", label = "Download" }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}${path}`, { credentials: "include" });
      if (!response.ok) {
        let message = `Download failed (${response.status})`;
        try {
          const body = await response.json();
          message = body?.message || body?.error?.message || message;
        } catch {}
        throw new Error(message);
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = fileName || "download";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || "Download failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="download-action">
      <button type="button" className="btn primary" onClick={download} disabled={busy}>{busy ? "Preparing..." : label}</button>
      {error && <small className="download-error">{error}</small>}
    </div>
  );
}
