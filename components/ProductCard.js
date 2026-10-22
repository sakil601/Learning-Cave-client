import Link from "next/link";
import WishlistButton from "./WishlistButton";
import { currentPrice, productHref, productTypeLabel } from "@/lib/routes";

function discountPercent(product) {
  const regular = Number(product?.regularPrice || 0);
  const price = Number(currentPrice(product));
  if (!regular || price >= regular) return 0;
  return Math.round(((regular - price) / regular) * 100);
}

export default function ProductCard({ product }) {
  const price = currentPrice(product);
  const discount = discountPercent(product);
  const category = product?.categories?.[0]?.name;
  const fallback =
    product?.type === "ebook"
      ? "/assets/thumbs/word.jpg"
      : product?.type === "digital_product"
        ? "/assets/thumbs/template.jpg"
        : "/assets/thumbs/excel.jpg";

  return (
    <article className="service-card has-card-icons">
      <Link
        className="service-card-link"
        href={productHref(product)}
        aria-label={`View ${product.title}`}
      >
        <div className="service-thumb" style={{ background: "#dff2e5" }}>
          <img src={product.thumbnail || fallback} alt={product.title} />
          {/* <span>{productTypeLabel(product.type)}</span> */}
        </div>

        <div className="service-body">
          <h3>{product.title}</h3>
          <p className="card-desc">
            {product.shortDescription ||
              "Practical learning from Learning Cave."}
          </p>

          <div className="service-tags">
            {category && <span className="tag-chip">{category}</span>}

            <span className="tag-chip">{productTypeLabel(product.type)}</span>
            {(product.tags || []).slice(0, 1).map((tag) => (
              <span className="tag-chip" key={tag}>
                {tag}
              </span>
            ))}
          </div>

          <div className="card-bottom">
            <div className="price-left">
              {product.isFree ? (
                <strong className="free-price">Free</strong>
              ) : (
                <strong>৳{Number(price).toLocaleString()}</strong>
              )}
              {discount > 0 && (
                <del>৳{Number(product.regularPrice).toLocaleString()}</del>
              )}
            </div>
            <div className="discount-right">
              {discount > 0 && <span className="sale-badge">-{discount}%</span>}
            </div>
          </div>
        </div>
      </Link>
      <WishlistButton productId={product._id} />
    </article>
  );
}
