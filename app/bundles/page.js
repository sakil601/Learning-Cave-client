import ProductListPage from "@/components/ProductListPage";
export const dynamic = "force-dynamic";
export const metadata = { title: "Course Bundles" };
export default function Page() {
  return <ProductListPage type="bundle" eyebrow="COURSE BUNDLE" title="Learning Bundles" description="Buy multiple Learning Cave products together in one package." />;
}
