export const courseTypeToPath = {
  recorded_course: "recorded",
  live_course: "live",
};

export const pathToCourseType = {
  recorded: "recorded_course",
  live: "live_course",
};

export function productHref(product) {
  const category = product?.categories?.[0]?.slug || "all";

  if (product?.type === "recorded_course") {
    if (!product?.categories?.[0]?.slug) return `/products/${product.slug}`;
    return `/courses/${category}/recorded/${product.slug}`;
  }

  if (product?.type === "live_course") {
    if (!product?.categories?.[0]?.slug) return `/products/${product.slug}`;
    return `/courses/${category}/live/${product.slug}`;
  }

  if (product?.type === "ebook") return `/ebooks/${product.slug}`;
  if (product?.type === "digital_product") return `/digital-products/${product.slug}`;
  if (product?.type === "bundle") return `/bundles/${product.slug}`;

  return `/products/${product.slug}`;
}

export function productTypeLabel(type) {
  return {
    recorded_course: "Recorded",
    live_course: "Live",
    ebook: "E-Book",
    digital_product: "Digital Product",
    bundle: "Bundle",
    workshop: "Workshop",
  }[type] || "Product";
}

export function currentPrice(product) {
  if (product?.isFree) return 0;
  return product?.salePrice ?? product?.regularPrice ?? 0;
}
