import { notFound } from "next/navigation";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";
import { currentPrice, productTypeLabel } from "@/lib/routes";
import { serverApiFetch } from "@/lib/server-api";

export default async function GenericProductDetail({ slug, expectedType }) {
  let product;
  try {
    product = (await serverApiFetch(`/products/${slug}`, { cache: "no-store" })).data;
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }
  if (expectedType && product.type !== expectedType) notFound();

  const price = currentPrice(product);
  const hasSale = !product.isFree && product.salePrice != null && Number(product.salePrice) < Number(product.regularPrice || 0);

  return (
    <section className="course-section section">
      <div className="container course-layout-v2">
        <div className="course-title-bar">
          <span className="ey">{productTypeLabel(product.type)}</span>
          <h1>{product.title}</h1>
          <p>{product.shortDescription}</p>
        </div>

        <div id="lc-course-main">
          <span className="ey">DESCRIPTION</span>
          <h2>Details</h2>
          <div className="descbox">
            {(product.description || product.shortDescription || "").split("\n").filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}
          </div>
          {!!product.tags?.length && (
            <div className="includes">
              <h2>Tags</h2>
              <div className="service-tags">{product.tags.map((tag) => <span className="tag-chip" key={tag}>{tag}</span>)}</div>
            </div>
          )}
        </div>

        <aside className="course-sidebar">
          <div className="side-preview-card">
            <div className="preview-video">
              <img src={product.thumbnail || "/assets/thumbs/template.jpg"} alt={product.title} />
            </div>
            <div className="preview-row">
              <div className="preview-price">
                <strong className={product.isFree ? "free-price" : ""}>{product.isFree ? "Free" : `৳${Number(price).toLocaleString()}`}</strong>
                {hasSale && <del>৳{Number(product.regularPrice).toLocaleString()}</del>}
              </div>
            </div>
            <div className="preview-tags">
              <span className="tag-chip">{productTypeLabel(product.type)}</span>
              {product.categories?.[0]?.name && <span className="tag-chip">{product.categories[0].name}</span>}
              <span className="tag-chip">{product.access?.type || "lifetime"} access</span>
            </div>
            <div className="preview-actions">
              <AddToCartButton productId={product._id} label={product.isFree ? "Get Now" : "Order Now"} />
              <div className="btn ghost icon-btn"><WishlistButton productId={product._id} /></div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
