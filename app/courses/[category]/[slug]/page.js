import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteData } from "@/lib/site-data";
import { AddToCart } from "@/components/ClientCart";
import "../../../styles.css";

export default async function CourseDetailPage({ params }) {
  const { category, slug } = await params;
  const data = await getSiteData();
  const section = data.sections?.find((x) => x.slug === "courses");
  const group = section?.groups?.find(
    (x) => x.slug === category && x.active !== false,
  );
  const subgroup = group?.subgroups?.find((sg) =>
    (sg.items || []).some(
      (item) => item.slug === slug && item.active !== false,
    ),
  );
  const item = subgroup?.items?.find(
    (x) => x.slug === slug && x.active !== false,
  );

  if (!item || !group) notFound();

  const final = Math.max(0, (item.price || 0) - (item.discount || 0));
  const discountPct = item.price
    ? Math.round(((item.discount || 0) / item.price) * 100)
    : 0;
  const whatsapp = data.brand?.whatsapp
    ? `https://wa.me/${String(data.brand.whatsapp).replace(/\D/g, "")}`
    : "#";
  // console.log(subgroup.slug);
  return (
    <>
      <section className="coursehero">
        <div className="container">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href="/courses">Courses</Link> /{" "}
            <Link href={`/courses/${group.slug}`}>
              {`${group.name} /    ${subgroup.slug}`}
            </Link>{" "}
            / {item.title}
          </div>

          <div className="course-top">
            <div className="course-title">
              <span className="ey">{item.badge}</span>
              <h1>{item.title}</h1>
              <p>Duration: {item.duration || "Self-paced"}</p>
              <div className="chips">
                {(item.highlights || "")
                  .split("\n")
                  .filter(Boolean)
                  .map((x) => (
                    <span key={x}>{x.replace(/^[-•]\s*/, "")}</span>
                  ))}
              </div>
            </div>

            <aside className="buybox">
              <span>PRICE</span>
              {item.discount > 0 && <del>৳{item.price.toLocaleString()}</del>}
              <strong>৳{final.toLocaleString()}</strong>
              {discountPct > 0 && (
                <em>
                  {discountPct}% OFF · Save ৳{item.discount.toLocaleString()}
                </em>
              )}
              <div className="buy-actions">
                <AddToCart
                  item={{
                    slug: item.slug,
                    title: item.title,
                    category: item.category,
                    price: item.price,
                    discount: item.discount,
                    finalPrice: final,
                    sku: item.sku,
                  }}
                />
                <a className="btn ghost" href="#course-details">
                  More Info
                </a>
              </div>
              <small>SKU: {item.sku}</small>
              <small>Category: {item.category}</small>
            </aside>
          </div>
        </div>
      </section>

      <section className="section course-detail-section" id="course-details">
        <div className="container">
          <div className="course-layout">
            <div>
              <span className="ey">DESCRIPTION</span>
              <h2>Details</h2>
              <div className="descbox">
                <div className="prose">
                  {(item.description || "")
                    .split("\n")
                    .map((line, index) =>
                      line.trim() ? (
                        <p key={index}>{line}</p>
                      ) : (
                        <br key={index} />
                      ),
                    )}
                </div>
              </div>

              <div className="includes">
                <h2>This course includes:</h2>
                <ul>
                  {(item.includes || []).map((x, index) => (
                    <li key={x}>
                      <span className="include-icon">
                        {index === 0 ? "◉" : index === 1 ? "▣" : "▤"}
                      </span>
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10">
                <span className="ey">COURSE OUTLINE</span>
                <h2 className="my-1">Course content</h2>
                <p className="mb-2 font-bold ml-2">
                  {item.outline?.length || 0} sections · practical learning path
                </p>
                {(item.outline || []).map((title, index) => (
                  <details
                    className="outline-row"
                    key={title}
                    open={index === 0}
                  >
                    <summary>{title}</summary>
                    {index === 0 && (
                      <div>
                        <ul>
                          <li>{title} — practical lesson and examples</li>
                          <li>Hands-on exercise and review</li>
                          <li>Key takeaways</li>
                        </ul>
                      </div>
                    )}
                  </details>
                ))}
              </div>
            </div>

            <aside className="side-info">
              <div className="info-card">
                <h3>Need more information?</h3>
                <p>Ask about details, availability and payment.</p>
                <a
                  className="btn primary"
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  Message on WhatsApp
                </a>
              </div>
              <div className="info-card">
                <h3>Tags</h3>
                {(item.tags || []).map((tag) => (
                  <p key={tag}>{tag}</p>
                ))}
                <p>Category: {item.category}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const data = await getSiteData();
  const section = data.sections?.find((x) => x.slug === "courses");
  const params = [];
  for (const group of section?.groups || []) {
    if (group.active === false) continue;
    for (const subgroup of group.subgroups || []) {
      for (const item of subgroup.items || []) {
        if (item.active !== false)
          params.push({ category: group.slug, slug: item.slug });
      }
    }
  }
  return params;
}
