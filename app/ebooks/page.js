import ProductListPage from "@/components/ProductListPage";
export const dynamic = "force-dynamic";
export const metadata = { title: "E-Books" };
export default function Page() {
  return <ProductListPage type="ebook" eyebrow="E-BOOK" title="Learning Cave E-Books" description="Practical guides and downloadable learning resources." />;
}
