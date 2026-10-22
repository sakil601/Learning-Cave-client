import ProductCard from "./ProductCard";
import { serverApiFetch } from "@/lib/server-api";

export default async function ProductListPage({ type, eyebrow, title, description }) {
  let products = [];
  try {
    products = (await serverApiFetch(`/products?type=${type}&limit=100`, { cache: "no-store" })).data || [];
  } catch {}

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="ey">{eyebrow}</span>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          {products.length ? (
            <div className="service-grid">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : <div className="product-list-empty">No published products found.</div>}
        </div>
      </section>
    </>
  );
}
