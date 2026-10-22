import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { pathToCourseType } from "@/lib/routes";
import { serverApiFetch } from "@/lib/server-api";

export const dynamic = "force-dynamic";

export default async function CourseTypePage({ params }) {
  const { category, type } = await params;
  const apiType = pathToCourseType[type];
  if (!apiType) notFound();

  let categoryData;
  let products = [];
  try {
    categoryData = (await serverApiFetch(`/categories/${category}`, { cache: "no-store" })).data;
    products = (await serverApiFetch(`/products?category=${categoryData._id}&type=${apiType}&limit=100`, { cache: "no-store" })).data || [];
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }

  const typeTitle = type === "recorded" ? "Recorded Courses" : "Live Courses";

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="course-breadcrumb"><Link href="/courses">Courses</Link><span>/</span><Link href={`/courses/${category}`}>{categoryData.name}</Link><span>/</span><span>{typeTitle}</span></div>
          <span className="ey">{type === "recorded" ? "SELF-PACED LEARNING" : "LIVE LEARNING"}</span>
          <h1>{categoryData.name} {typeTitle}</h1>
          <p>{products.length} published {products.length === 1 ? "course" : "courses"} available.</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="listing-toolbar"><div><strong>{typeTitle}</strong><span>{categoryData.name}</span></div><Link href={`/courses/${category}`}>Change course type</Link></div>
          {products.length ? (
            <div className="service-grid">
              {products.map((product) => <ProductCard key={product._id} product={product} />)}
            </div>
          ) : <div className="product-list-empty">No published {type} courses found in this category.</div>}
        </div>
      </section>
    </>
  );
}
