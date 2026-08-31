import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteData, allItems } from "@/lib/site-data";
import { AddToCart } from "@/components/ClientCart";
import { FiPlayCircle, FiFileText, FiList, FiAward } from "react-icons/fi";

export default async function ItemPage({ params }) {
  const { section, slug } = await params;

  const d = await getSiteData();

  const item = allItems(d).find(
    (x) => x.sectionSlug === section && x.slug === slug,
  );

  if (!item) notFound();

  const price = Number(item.price || 0);
  const discount = Number(item.discount || 0);
  const finalPrice = Math.max(0, price - discount);

  const discountPercent = price > 0 ? Math.round((discount / price) * 100) : 0;

  const descriptionLines = String(item.description || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const descriptionParagraphs = descriptionLines.filter(
    (line) => !line.startsWith("-"),
  );

  const descriptionBullets = descriptionLines
    .filter((line) => line.startsWith("-"))
    .map((line) => line.replace(/^-\s*/, ""));

  return (
    <div className="course-detail-page">
      {/* =========================================
          COURSE HERO
      ========================================== */}

      <section className="course-detail-hero">
        <div className="course-detail-container">
          {/* Breadcrumb */}
          <div className="course-breadcrumb">
            <Link href="/">Home</Link>

            <span>/</span>

            <Link href={`/${section}`}>{item.sectionLabel}</Link>

            <span>/</span>

            <span>{item.group}</span>

            <span>/</span>

            <span>{item.subgroup}</span>

            <span>/</span>

            <span>{item.title}</span>
          </div>

          <div className="course-hero-grid">
            {/* =================================
                LEFT
            ================================= */}

            <div className="course-hero-content">
              <div className="course-eyebrow">{item.badge}</div>

              <h1>{item.title}</h1>

              <p className="course-duration">Duration: {item.duration}</p>

              {/* Highlights */}

              <div className="course-highlights">
                {(item.highlights || "")
                  .split("\n")
                  .filter(Boolean)
                  .map((highlight) => (
                    <span key={highlight}>
                      {highlight.replace(/^-\s*/, "")}
                    </span>
                  ))}
              </div>
            </div>

            {/* =================================
                PRICE BOX
            ================================= */}

            <div className="course-buy-box">
              <div className="price-label">PRICE</div>

              {discount > 0 && (
                <div className="old-price">৳{price.toLocaleString()}</div>
              )}

              <div className="current-price">
                ৳{finalPrice.toLocaleString()}
              </div>

              {discount > 0 && (
                <div className="discount-message">
                  {discountPercent}% OFF • Save ৳{discount.toLocaleString()}
                </div>
              )}

              <div className="course-buy-actions">
                <AddToCart
                  item={{
                    slug: item.slug,
                    title: item.title,
                    category: item.category,
                    price: price,
                    discount: discount,
                    finalPrice: finalPrice,
                    sku: item.sku,
                  }}
                />

                <a href="#course-details" className="course-more-info">
                  More Info
                </a>
              </div>

              <div className="course-meta">SKU: {item.sku}</div>

              <div className="course-meta">Category: {item.category}</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          DETAILS
      ========================================== */}

      <section id="course-details" className="course-details-section">
        <div className="course-detail-container">
          <div className="course-content-grid">
            {/* =================================
                MAIN CONTENT
            ================================= */}

            <div className="course-main-content">
              <div className="course-section-eyebrow">DESCRIPTION</div>

              <h2>Details</h2>

              {/* Description Box */}

              <div className="course-description-box">
                {descriptionParagraphs.map((text, index) => (
                  <p key={index}>{text}</p>
                ))}

                {descriptionBullets.length > 0 && (
                  <ul>
                    {descriptionBullets.map((text) => (
                      <li key={text}>{text}</li>
                    ))}
                  </ul>
                )}
              </div>

              {/* =================================
                  COURSE INCLUDES
              ================================= */}

              <div className="course-includes">
                <h2>This course includes:</h2>

                <ul>
                  {(item.includes || []).map((include, index) => {
                    const icons = [
                      <FiPlayCircle key="play" />,
                      <FiFileText key="file" />,
                      <FiList key="list" />,
                      <FiAward key="award" />,
                    ];

                    return (
                      <li key={include}>
                        <span className="include-circle">
                          {icons[index % icons.length]}
                        </span>

                        <span>{include}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* =================================
                  COURSE OUTLINE
              ================================= */}

              <div className="course-outline">
                <div className="course-section-eyebrow">COURSE OUTLINE</div>

                <h2>Course content</h2>

                <p className="outline-summary">
                  {item.outline?.length || 0} sections · practical learning path
                </p>

                <div className="outline-list">
                  {(item.outline || []).map((sectionName, index) => (
                    <details
                      key={sectionName}
                      className="outline-item"
                      open={index === 0}
                    >
                      <summary>{sectionName}</summary>

                      {index === 0 && (
                        <div className="outline-description">
                          <ul>
                            <li>
                              Introduction and learning goals — practical lesson
                              and examples
                            </li>

                            <li>Hands-on exercise and review</li>

                            <li>Key takeaways</li>
                          </ul>
                        </div>
                      )}
                    </details>
                  ))}
                </div>
              </div>
            </div>

            {/* =================================
                RIGHT SIDEBAR
            ================================= */}

            <aside className="course-sidebar">
              {/* Information */}

              <div className="course-sidebar-card">
                <h3>Need more information?</h3>

                <p>Ask about details, availability and payment.</p>

                <a
                  href="https://wa.me/8801629112959"
                  target="_blank"
                  rel="noreferrer"
                  className="whatsapp-button"
                >
                  Message on WhatsApp
                </a>
              </div>

              {/* Tags */}

              <div className="course-sidebar-card">
                <h3>Tags</h3>

                <div className="course-tags">
                  {(item.tags || []).map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>

                <p className="sidebar-category">Category: {item.category}</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  );
}
