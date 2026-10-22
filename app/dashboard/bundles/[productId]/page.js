"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { productHref, productTypeLabel } from "@/lib/routes";
import { useAuth } from "@/components/AuthProvider";

export default function Page() {
  const { productId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) return router.replace(`/login?next=/dashboard/bundles/${productId}`);
    apiFetch(`/bundles/me/${productId}`).then((x) => setData(x.data)).catch((e) => setError(e.message));
  }, [loading, user, productId, router]);

  if (loading || (!data && !error)) return <section className="dashboard-section"><div className="product-list-empty">Loading bundle...</div></section>;
  if (error) return <section className="dashboard-section"><div className="product-list-empty">{error}</div></section>;

  const items = data.bundle?.items || [];
  return (
    <>
      <section className="dashboard-hero">
        <span className="ey">MY BUNDLE</span>
        <h1>{data.product?.title}</h1>
        <p>{data.product?.shortDescription || `Purchased with order ${data.purchase?.orderNumber || ""}`}</p>
      </section>
      <section className="dashboard-section">
        <div className="owned-summary-strip">
          <div><span>Included products</span><strong>{items.length}</strong></div>
          <div><span>Order</span><strong>{data.purchase?.orderNumber || "—"}</strong></div>
          <div><span>Paid</span><strong>{data.purchase?.paidAmount != null ? `৳${Number(data.purchase.paidAmount).toLocaleString()}` : "—"}</strong></div>
        </div>
        <div className="bundle-owned-grid">
          {items.map((item, index) => {
            const product = item.product;
            return (
              <article className="bundle-owned-card" key={product?._id || index}>
                <img src={product?.thumbnail || "/assets/thumbs/template.jpg"} alt={product?.title || "Bundle item"} />
                <div>
                  <span className="ey small-ey">{productTypeLabel(product?.type)}</span>
                  <h3>{product?.title || "Product"}</h3>
                  <p>{product?.shortDescription || "Included in your bundle."}</p>
                  {product && <Link className="btn ghost" href={productHref(product)}>View Details</Link>}
                </div>
              </article>
            );
          })}
          {!items.length && <div className="product-list-empty">No bundle items found.</div>}
        </div>
      </section>
    </>
  );
}
