import Link from "next/link";
import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/site-data";
import "../styles.css";

const categoryStyles = [
  { bg: "#dff2e5", color: "#176d3d" },
  { bg: "#e5effd", color: "#245b93" },
  { bg: "#fff0c9", color: "#805900" },
  { bg: "#ffe39a", color: "#755000" },
  { bg: "#ffe7dd", color: "#9a4025" },
];

function initials(name) {
  const value = String(name || "").trim();
  if (value.toLowerCase().includes("power query")) return "Power\nQuery";
  if (value.toLowerCase().includes("power bi")) return "Power\nBI";
  return value.split(/\s+/).slice(-1)[0] || value.slice(0, 2);
}

export default async function CoursesPage() {
  const data = await getSiteData();
  const section = data.sections?.find((x) => x.slug === "courses");
  if (!section) notFound();

  const groups = (section.groups || []).filter((g) => g.active !== false);

  return (
    <>
      <section className="courses-page-hero">
        <div className="container">
          <div className="crumb">
            <Link href="/">Home</Link> / Courses
          </div>
          <span className="ey">COURSE CATEGORIES</span>
          <h1>Choose your learning path.</h1>
        </div>
      </section>

      <section className="courses-category-section">
        <div className="container">
          <div className="course-category-grid">
            {groups.map((group, index) => {
              const style = categoryStyles[index % categoryStyles.length];
              const count = (group.subgroups || []).reduce(
                (total, sg) =>
                  total +
                  (sg.items || []).filter((item) => item.active !== false).length,
                0,
              );

              return (
                <Link
                  key={group.slug}
                  href={`/courses/${group.slug}`}
                  className="course-category-card"
                >
                  <div
                    className="course-category-icon"
                    style={{ backgroundColor: style.bg, color: style.color }}
                  >
                    {initials(group.name)
                      .split("\n")
                      .map((line) => (
                        <span key={line}>{line}</span>
                      ))}
                  </div>
                  <h2>{group.name}</h2>
                  <strong>{count} Items</strong>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
