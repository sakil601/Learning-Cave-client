import Link from "next/link";
import { serverApiFetch } from "@/lib/server-api";

export const dynamic = "force-dynamic";
export const metadata = { title: "Courses" };

const colors = [
  ["#e3f7ea", "#1c7d3f"],
  ["#e5effd", "#245b93"],
  ["#fff0c9", "#805900"],
  ["#ffe39a", "#755000"],
  ["#ffe0d2", "#9a4025"],
];

function initials(name = "") {
  return name.split(/\s+/).filter(Boolean).map((x) => x[0]).join("").slice(0, 2).toUpperCase();
}

export default async function CoursesPage() {
  let categories = [];
  try {
    categories = (await serverApiFetch("/categories?parent=root", { cache: "no-store" }))?.data || [];
  } catch {}

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="ey">COURSES</span>
          <h1>Choose what you want to learn.</h1>
          <p>Start with a main course category, then choose Recorded or Live learning.</p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="topic-grid">
            {categories.map((category, index) => {
              const [bg, color] = colors[index % colors.length];
              return (
                <Link className="topic-card" href={`/courses/${category.slug}`} key={category._id}>
                  <span className="topic-icon" style={{ background: bg, color }}>{initials(category.name)}</span>
                  <span className="topic-label">{category.name}<i style={{ background: color }} /></span>
                </Link>
              );
            })}
          </div>
          {!categories.length && <div className="product-list-empty">No active course categories found.</div>}
        </div>
      </section>
    </>
  );
}
