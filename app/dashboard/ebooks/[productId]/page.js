"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import SecureDownloadButton from "@/components/SecureDownloadButton";

function sizeLabel(size) {
  const bytes = Number(size || 0);
  if (!bytes) return "File size unavailable";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function Page() {
  const { productId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) return router.replace(`/login?next=/dashboard/ebooks/${productId}`);
    apiFetch(`/ebooks/me/${productId}`).then((x) => setData(x.data)).catch((e) => setError(e.message));
  }, [loading, user, productId, router]);

  if (loading || (!data && !error)) return <section className="dashboard-section"><div className="product-list-empty">Loading e-book...</div></section>;
  if (error) return <section className="dashboard-section"><div className="product-list-empty">{error}</div></section>;

  const asset = data.ebook?.mainAsset;
  return (
    <>
      <section className="dashboard-hero">
        <span className="ey">MY E-BOOK</span>
        <h1>{data.product?.title}</h1>
        <p>{data.product?.shortDescription || "Your purchased e-book is ready to read or download."}</p>
      </section>
      <section className="dashboard-section owned-detail-grid">
        <div className="owned-cover-card">
          <img src={data.product?.thumbnail || "/assets/thumbs/ebook.jpg"} alt={data.product?.title || "E-book"} />
        </div>
        <div className="owned-main-card">
          <div className="owned-meta-grid">
            <div><span>Author</span><strong>{data.ebook?.author || "Learning Cave"}</strong></div>
            <div><span>Version</span><strong>{data.ebook?.version || "1.0"}</strong></div>
            <div><span>Access</span><strong>{data.access?.expiresAt ? `Until ${new Date(data.access.expiresAt).toLocaleDateString()}` : "Lifetime"}</strong></div>
            <div><span>File</span><strong>{asset?.fileName || "Not available"}</strong></div>
          </div>
          {asset ? (
            <div className="owned-download-row">
              <div><h3>{asset.fileName}</h3><p>{asset.mimeType || "Document"} · {sizeLabel(asset.size)}</p></div>
              <SecureDownloadButton path={`/ebooks/me/${productId}/download`} fileName={asset.fileName} label="Download E-Book" />
            </div>
          ) : <div className="product-list-empty">The e-book file is not available yet.</div>}
        </div>
      </section>
    </>
  );
}
