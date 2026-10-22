import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/AddToCartButton";
import WishlistButton from "@/components/WishlistButton";
import LiveBatchPurchase from "@/components/LiveBatchPurchase";
import { GLOBAL_FAQ } from "@/lib/static-content";
import { currentPrice, pathToCourseType } from "@/lib/routes";
import { serverApiFetch } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const result = await serverApiFetch(`/products/${slug}`, { cache: "no-store" });
    const p = result.data;
    return {
      title: p.seo?.metaTitle || p.title,
      description: p.seo?.metaDescription || p.shortDescription,
      openGraph: {
        images: p.seo?.ogImage || p.thumbnail ? [p.seo?.ogImage || p.thumbnail] : [],
      },
    };
  } catch {
    return { title: "Course" };
  }
}

function PriceBlock({ product }) {
  const price = currentPrice(product);
  const hasSale = !product.isFree && product.salePrice != null && Number(product.salePrice) < Number(product.regularPrice || 0);
  const discount = hasSale && product.regularPrice
    ? Math.round(((Number(product.regularPrice) - Number(product.salePrice)) / Number(product.regularPrice)) * 100)
    : 0;

  return (
    <>
      <div className="preview-row">
        <div className="preview-price">
          <strong className={product.isFree ? "free-price" : ""}>
            {product.isFree ? "Free" : `৳${Number(price).toLocaleString()}`}
          </strong>
          {hasSale && <del>৳{Number(product.regularPrice).toLocaleString()}</del>}
        </div>
      </div>
      {discount > 0 && <div className="preview-disc"><span className="sale-badge">-{discount}%</span></div>}
    </>
  );
}

function Stars({ value = 0 }) {
  const rounded = Math.round(Number(value || 0));
  return <span className="review-stars" aria-label={`${value} out of 5 stars`}>{[1, 2, 3, 4, 5].map((n) => n <= rounded ? "★" : "☆").join("")}</span>;
}

async function RecordedDetail({ category, slug }) {
  let result;
  try {
    result = await serverApiFetch(`/courses/${slug}`, { cache: "no-store" });
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }

  const { product, course, curriculum } = result.data;
  const categoryName = product.categories?.[0]?.name || category;
  const totalLessons = (curriculum || []).reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
  const totalMinutes = Math.ceil((curriculum || []).flatMap((module) => module.lessons || []).reduce((sum, lesson) => sum + Number(lesson.video?.duration || 0), 0) / 60);

  let reviews = [];
  try {
    reviews = (await serverApiFetch(`/reviews/courses/${course._id}`, { cache: "no-store" })).data || [];
  } catch {
    reviews = [];
  }

  return (
    <>
      <section className="course-section section">
        <div className="container course-layout-v2">
          <div className="course-title-bar">
            <div className="course-breadcrumb">
              <Link href="/courses">Courses</Link>
              <span>/</span>
              <Link href={`/courses/${category}`}>{categoryName}</Link>
              <span>/</span>
              <Link href={`/courses/${category}/recorded`}>Recorded</Link>
            </div>
            <span className="ey">RECORDED COURSE</span>
            <h1>{product.title}</h1>
            <p>{product.shortDescription}</p>
            <div className="course-meta-row">
              <span>{course.level || "beginner"} level</span>
              <span>{course.language || "bn"}</span>
              <span>{totalLessons} lessons</span>
              {totalMinutes > 0 && <span>{totalMinutes} min total</span>}
              <span><Stars value={product.ratingSummary?.average || 0} /> {Number(product.ratingSummary?.average || 0).toFixed(1)} ({product.ratingSummary?.count || 0})</span>
            </div>
          </div>

          <div className="item-tabs">
            <a className="item-tab active" href="#details">Details</a>
            <a className="item-tab" href="#content">Course Content</a>
            <a className="item-tab" href="#instructor">Instructor</a>
            <a className="item-tab" href="#faq">FAQ</a>
            <a className="item-tab" href="#reviews">Reviews</a>
          </div>

          <div id="lc-course-main">
            <section id="details">
              <span className="ey">DESCRIPTION</span>
              <h2>Details</h2>
              <div className="descbox">
                {(product.description || product.shortDescription || "").split("\n").filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}
              </div>

              <div className="course-feature-grid">
                <div><strong>{totalLessons}</strong><span>Lessons</span></div>
                <div><strong>{curriculum?.length || 0}</strong><span>Modules</span></div>
                <div><strong>{course.certificate?.enabled ? "Yes" : "No"}</strong><span>Certificate</span></div>
                <div><strong>{product.access?.type === "limited" ? "Limited" : "Lifetime"}</strong><span>Access</span></div>
              </div>
            </section>

            <section className="outline" id="content">
              <div className="section-heading-row">
                <div><span className="ey">COURSE OUTLINE</span><h2>Course Content</h2></div>
                <span>{curriculum?.length || 0} modules · {totalLessons} lessons</span>
              </div>

              {(curriculum || []).map((module, index) => (
                <details className="outline-row" key={module._id} open={index === 0}>
                  <summary>
                    <span className="outline-title">{module.title}</span>
                    <span className="outline-right"><span className="outline-count">{module.lessons?.length || 0} lessons</span><span className="outline-chev">›</span></span>
                  </summary>
                  <div>
                    {module.description && <p>{module.description}</p>}
                    <ul className="course-lesson-list">
                      {(module.lessons || []).map((lesson) => (
                        <li key={lesson._id}>
                          <span className="course-lesson-icon">▶</span>
                          <span>{lesson.title}</span>
                          <span className="course-lesson-meta">{lesson.isPreview ? "Preview" : "Locked"}{lesson.video?.duration ? ` · ${Math.ceil(lesson.video.duration / 60)} min` : ""}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </details>
              ))}
            </section>

            <section className="outline" id="instructor">
              <span className="ey">INSTRUCTOR</span>
              <h2>Meet Your Instructor</h2>
              <div className="instructor-card instructor-card-v2">
                <div className="instructor-avatar">{(course.instructor?.name || "LC").slice(0, 1).toUpperCase()}</div>
                <div>
                  <h3>{course.instructor?.name || "Learning Cave Instructor"}</h3>
                  <p className="instructor-title">Course Instructor</p>
                  <p className="instructor-bio">Learn through structured lessons, examples and practice designed around the course curriculum.</p>
                </div>
              </div>
            </section>

            <section className="outline" id="faq">
              <span className="ey">FAQ</span>
              <h2>Frequently Asked Questions</h2>
              <div className="faq-list">
                {GLOBAL_FAQ.map((item, index) => (
                  <details className="faq-row" key={item.q} open={index === 0}>
                    <summary>{item.q}<span className="outline-chev">›</span></summary>
                    <div>{item.a}</div>
                  </details>
                ))}
              </div>
            </section>

            <section className="outline" id="reviews">
              <span className="ey">REVIEWS</span>
              <h2>Student Reviews</h2>
              <div className="review-summary review-summary-v2">
                <div><strong>{Number(product.ratingSummary?.average || 0).toFixed(1)}</strong><Stars value={product.ratingSummary?.average || 0} /><span>{product.ratingSummary?.count || 0} reviews</span></div>
                <p>Reviews shown here come from enrolled students through the backend review system.</p>
              </div>
              <div className="review-list">
                {reviews.map((review) => (
                  <article className="review-row" key={review._id}>
                    <div className="review-row-head"><strong>{review.user?.name || "Student"}</strong><Stars value={review.rating} /></div>
                    <p>{review.review || "Rated this course."}</p>
                  </article>
                ))}
                {!reviews.length && <div className="product-list-empty">No published reviews yet.</div>}
              </div>
            </section>
          </div>

          <aside className="course-sidebar">
            <div className="side-preview-card">
              <div className="preview-video">
                <img src={product.thumbnail || "/assets/thumbs/excel.jpg"} alt={product.title} />
              </div>
              <PriceBlock product={product} />
              <div className="preview-tags">
                <span className="tag-chip">{categoryName}</span>
                <span className="tag-chip">Recorded</span>
                <span className="tag-chip">{course.level || "beginner"}</span>
              </div>
              <div className="preview-actions">
                <AddToCartButton productId={product._id} label={product.isFree ? "Get Course" : "Enroll Now"} />
                <div className="btn ghost icon-btn"><WishlistButton productId={product._id} /></div>
              </div>
            </div>

            <div className="info-card highlights-card">
              <h3>This course includes</h3>
              <ul className="highlights-list">
                <li>{totalLessons} structured lessons</li>
                {totalMinutes > 0 && <li>About {totalMinutes} minutes of lessons</li>}
                <li>{course.language || "bn"} language</li>
                <li>{product.access?.type === "limited" ? `Limited access${product.access?.duration ? ` · ${product.access.duration} ${product.access.durationUnit}` : ""}` : "Lifetime access"}</li>
                {course.certificate?.enabled && <li>Certificate available</li>}
              </ul>
            </div>
          </aside>
        </div>
      </section>

      <div className="sticky-buybar">
        <div><span>{product.title}</span><strong>{product.isFree ? "Free" : `৳${Number(currentPrice(product)).toLocaleString()}`}</strong></div>
        <AddToCartButton productId={product._id} label={product.isFree ? "Get Course" : "Enroll Now"} />
      </div>
    </>
  );
}

async function LiveDetail({ category, slug }) {
  let result;
  try {
    result = await serverApiFetch(`/products/${slug}`, { cache: "no-store" });
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }
  const product = result.data;
  if (product.type !== "live_course") notFound();

  let liveData = { liveCourse: null, batches: [] };
  try {
    const batchResult = await serverApiFetch(`/live-courses/${slug}/batches`, { cache: "no-store" });
    liveData = batchResult.data || liveData;
  } catch {
    liveData = { liveCourse: null, batches: [] };
  }

  return (
    <section className="course-section section">
      <div className="container course-layout-v2">
        <div className="course-title-bar">
          <div className="course-breadcrumb"><Link href="/courses">Courses</Link><span>/</span><Link href={`/courses/${category}`}>{product.categories?.[0]?.name || category}</Link><span>/</span><Link href={`/courses/${category}/live`}>Live</Link></div>
          <span className="ey">LIVE COURSE</span>
          <h1>{product.title}</h1>
          <p>{product.shortDescription}</p>
        </div>

        <div id="lc-course-main">
          <span className="ey">DESCRIPTION</span>
          <h2>Details</h2>
          <div className="descbox">
            {(product.description || product.shortDescription || "").split("\n").filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}
          </div>
          <div className="outline">
            <span className="ey">LIVE LEARNING</span>
            <h2>Available Batches</h2>
            {liveData.liveCourse?.instructor?.name && <p className="admin-help">Instructor: <strong>{liveData.liveCourse.instructor.name}</strong> · {liveData.liveCourse.meetingProvider || "Live class"}</p>}
            <div className="live-batch-list">
              {(liveData.batches || []).map((batch) => (
                <article className="live-batch-card" key={batch._id}>
                  <div><strong>{batch.name}</strong><small>{batch.status} · {batch.seatsRemaining == null ? "Open seats" : `${batch.seatsRemaining} seats left`}</small></div>
                  <div><span>{batch.startDate ? new Date(batch.startDate).toLocaleDateString("en-GB") : "—"}</span><span>to</span><span>{batch.endDate ? new Date(batch.endDate).toLocaleDateString("en-GB") : "—"}</span></div>
                </article>
              ))}
              {!liveData.batches?.length && <div className="info-card"><p>No batch is currently open for enrollment.</p></div>}
            </div>
          </div>
        </div>

        <aside className="course-sidebar">
          <div className="side-preview-card">
            <div className="preview-video"><img src={product.thumbnail || "/assets/thumbs/excel.jpg"} alt={product.title} /></div>
            <PriceBlock product={product} />
            <div className="preview-tags"><span className="tag-chip">{product.categories?.[0]?.name || category}</span><span className="tag-chip">Live</span></div>
            <div className="preview-actions live-preview-actions">
              <LiveBatchPurchase productId={product._id} batches={liveData.batches || []} />
              <div className="btn ghost icon-btn"><WishlistButton productId={product._id} /></div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default async function CourseDetailPage({ params }) {
  const { category, type, slug } = await params;
  const apiType = pathToCourseType[type];
  if (!apiType) notFound();
  if (apiType === "recorded_course") return <RecordedDetail category={category} slug={slug} />;
  return <LiveDetail category={category} slug={slug} />;
}
