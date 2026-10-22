"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import SecureDownloadButton from "@/components/SecureDownloadButton";

function sizeLabel(size) {
  const bytes = Number(size || 0);
  if (!bytes) return "Size unavailable";
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
    if (!user) return router.replace(`/login?next=/dashboard/digital-products/${productId}`);
    apiFetch(`/digital-products/me/${productId}`).then((x) => setData(x.data)).catch((e) => setError(e.message));
  }, [loading, user, productId, router]);

  if (loading || (!data && !error)) return <section className="dashboard-section"><div className="product-list-empty">Loading product...</div></section>;
  if (error) return <section className="dashboard-section"><div className="product-list-empty">{error}</div></section>;

  const files = data.digitalProduct?.files || [];
  return (
    <>
      <section className="dashboard-hero">
        <span className="ey">MY DIGITAL PRODUCT</span>
        <h1>{data.product?.title}</h1>
        <p>{data.product?.shortDescription || "Your purchased files are available below."}</p>
      </section>
      <section className="dashboard-section">
        <div className="owned-summary-strip">
          <div><span>Files</span><strong>{files.length}</strong></div>
          <div><span>Access</span><strong>{data.access?.expiresAt ? `Until ${new Date(data.access.expiresAt).toLocaleDateString()}` : "Lifetime"}</strong></div>
          <div><span>Updates</span><strong>{data.digitalProduct?.existingBuyersCanAccessUpdate ? "Included" : "Version purchased"}</strong></div>
        </div>
        <div className="download-list">
          {files.map((file, index) => (
            <article className="download-file-card" key={file.assetId || index}>
              <div className="download-file-icon">{String(file.fileName || file.title || "FILE").split(".").pop().slice(0, 4).toUpperCase()}</div>
              <div className="download-file-info">
                <h3>{file.title || file.fileName || `File ${index + 1}`}</h3>
                <p>{file.fileName || "Download file"} · Version {file.version || "—"} · {sizeLabel(file.size)}</p>
              </div>
              {file.assetId && <SecureDownloadButton path={`/digital-products/me/${productId}/files/${file.assetId}/download`} fileName={file.fileName || file.title || "download"} />}
            </article>
          ))}
          {!files.length && <div className="product-list-empty">No files available yet.</div>}
        </div>
      </section>
    </>
  );
}
