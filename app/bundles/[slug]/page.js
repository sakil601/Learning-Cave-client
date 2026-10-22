import GenericProductDetail from "@/components/GenericProductDetail";
export const dynamic = "force-dynamic";
export default async function Page({ params }) { const { slug } = await params; return <GenericProductDetail slug={slug} expectedType="bundle" />; }
