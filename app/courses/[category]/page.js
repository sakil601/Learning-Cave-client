import { notFound } from "next/navigation";
import Link from "next/link";
import { getSiteData } from "@/lib/site-data";
import ItemCard from "@/components/ItemCard";
import "../../styles.css";

export default async function CourseCategoryPage({ params }) {
  const { category } = await params;
  const data = await getSiteData();
  const section = data.sections?.find((x) => x.slug === "courses");
  const group = section?.groups?.find(
    (x) => x.slug === category && x.active !== false,
  );

  if (!section || !group) notFound();

  const subgroups = (group.subgroups || []).filter(
    (sg) => sg.active !== false && (sg.items || []).some((i) => i.active !== false),
  );

  return (
    <>
      <section className="course-category-hero">
        <div className="container">
          <div className="crumb">
            <Link href="/">Home</Link> / <Link href="/courses">Courses</Link> / {group.name}
          </div>
          <span className="ey">COURSES</span>
          <h1>{group.name}</h1>
        </div>
      </section>

      <section className="section course-list-section">
        <div className="container">
          {subgroups.map((sg) => {
            const items = (sg.items || []).filter((i) => i.active !== false);
            if (!items.length) return null;

            return (
              <div className="course-type-block" key={sg.slug}>
                <h2>{sg.name}</h2>
                <div className="service-grid course-card-grid">
                  {items.map((item) => (
                    <ItemCard
                      key={item.slug}
                      item={item}
                      section="courses"
                      category={group.slug}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const data = await getSiteData();
  const section = data.sections?.find((x) => x.slug === "courses");
  return (section?.groups || []).filter((g) => g.active !== false).map((g) => ({
    category: g.slug,
  }));
}
