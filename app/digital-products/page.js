import ProductListPage from "@/components/ProductListPage";
export const dynamic = "force-dynamic";
export const metadata = { title: "Digital Products" };
export default function Page() {
  return <ProductListPage type="digital_product" eyebrow="DIGITAL PRODUCT" title="Digital Products" description="Templates, files and productivity resources." />;
}
