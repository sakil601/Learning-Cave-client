import { redirect, notFound } from "next/navigation";
import { serverApiFetch } from "@/lib/server-api";
import { productHref } from "@/lib/routes";

export const dynamic = "force-dynamic";

export default async function ProductResolverPage({ params }) {
  const { slug } = await params;
  let product;
  try {
    product = (await serverApiFetch(`/products/${slug}`, { cache: "no-store" })).data;
  } catch (error) {
    if (error.status === 404) notFound();
    throw error;
  }
  redirect(productHref(product));
}
