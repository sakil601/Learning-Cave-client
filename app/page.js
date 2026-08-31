import Link from "next/link";
import { getSiteData, allItems } from "@/lib/site-data";
import ItemCard from "@/components/ItemCard";
import Slider from "@/components/Slider";
export default async function Home() {
  const d = await getSiteData();
  const items = allItems(d)
    .filter((i) => i.active !== false)
    .slice(0, 12);

  const courses = d.sections.find((u) => u.slug === "courses");
  // console.log(courses.groups);
  return (
    <>
      {/* =====================================
          HOME HERO / SLIDER
          Only Home Page
      ====================================== */}

      <Slider data={courses.groups} />

      {/* =====================================
          COURSES & PRODUCTS
      ====================================== */}
      <section className="section">
        <div className="container">
          <span className="ey">EXPLORE</span>
          <h2>Courses & Products</h2>
          <div className="service-grid">
            {items.map((i) => (
              <ItemCard
                key={i.slug}
                item={i}
                section={i.sectionSlug}
                category={i.groupSlug}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
