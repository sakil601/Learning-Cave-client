import Link from "next/link";
export default function ItemCard({ item, section, category }) {
  const final = Math.max(0, (item.price || 0) - (item.discount || 0));
  const pct = item.price ? Math.round((item.discount / item.price) * 100) : 0;
  const href = section === "courses" && category
    ? `/courses/${category}/${item.slug}`
    : `/${section}/${item.slug}`;

  return (
    <Link className="service-card" href={href}>
      <div className="service-thumb">
        <img src={"/" + item.thumbnail} alt={item.title} />
        <span>{item.badge}</span>
      </div>
      <div className="service-body">
        <h3>{item.title}</h3>
        <div className="service-tags">
          {(item.tags || []).map((t) => (
            <span className="tag-chip" key={t}>
              {t}
            </span>
          ))}
        </div>
        <div className="card-bottom">
          <div className="price-left">
            <strong>৳{final.toLocaleString()}</strong>
            {item.discount > 0 && <del>৳{item.price.toLocaleString()}</del>}
          </div>
          {pct > 0 && (
            <div className="discount-right">
              <span className="sale-badge">-{pct}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
