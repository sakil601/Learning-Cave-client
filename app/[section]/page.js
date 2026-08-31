import { notFound } from "next/navigation";
import { getSiteData } from "@/lib/site-data";
import SectionGrid from "@/components/SectionGrid";
export default async function SectionPage({ params }) {
  const { section } = await params;
  const d = await getSiteData();
  const s = d.sections.find((x) => x.slug === section);
  if (!s) notFound();
  return <SectionGrid section={s} />;
}
export async function generateStaticParams() {
  return [
    { section: "courses" },
    { section: "ebooks" },
    { section: "digital-products" },
  ];
}
