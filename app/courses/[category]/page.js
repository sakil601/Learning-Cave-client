import Link from "next/link";
import { notFound } from "next/navigation";
import { serverApiFetch } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }) {
  const { category } = await params;
  let categoryData;
  let products = [];

  try {
    categoryData = (await serverApiFetch(`/categories/${category}`, { cache: "no-store" })).data;
    products = (await serverApiFetch(`/products?category=${categoryData._id}&limit=100`, { cache: "no-store" })).data || [];
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }

  const recorded = products.filter((x) => x.type === "recorded_course");
  const live = products.filter((x) => x.type === "live_course");

  return (
    <>
      <section className="page-hero course-category-hero-v2">
        <div className="container">
          <div className="course-breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/courses">Courses</Link><span>/</span><span>{categoryData.name}</span></div>
          <span className="ey">COURSES</span>
          <h1>{categoryData.name}</h1>
          <p>{categoryData.description || "Choose how you want to learn."}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="type-grid type-grid-v2">
            <Link className={`type-card type-card-v2${recorded.length ? "" : " muted"}`} href={recorded.length ? `/courses/${category}/recorded` : "#"} aria-disabled={!recorded.length}>
              <div className="type-card-icon">▶</div>
              <div><span>SELF-PACED</span><h2>Recorded Courses</h2><p>Structured modules, lessons, progress tracking and quizzes.</p></div>
              <div className="type-card-footer"><strong>{recorded.length}</strong><span>{recorded.length === 1 ? "course" : "courses"}</span><b>Explore →</b></div>
            </Link>

            <Link className={`type-card type-card-v2${live.length ? "" : " muted"}`} href={live.length ? `/courses/${category}/live` : "#"} aria-disabled={!live.length}>
              <div className="type-card-icon">●</div>
              <div><span>LIVE LEARNING</span><h2>Live Courses</h2><p>Join scheduled batches and live sessions with your instructor.</p></div>
              <div className="type-card-footer"><strong>{live.length}</strong><span>{live.length === 1 ? "course" : "courses"}</span><b>Explore →</b></div>
            </Link>
          </div>

          {!recorded.length && !live.length && <div className="product-list-empty">No published recorded or live courses are available in this category yet.</div>}
        </div>
      </section>
    </>
  );
}
