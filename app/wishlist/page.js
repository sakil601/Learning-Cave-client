"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { productHref, currentPrice } from "@/lib/routes";
import { useAuth } from "@/components/AuthProvider";
import { useWishlist } from "@/components/WishlistProvider";
import FlashMessage from "@/components/FlashMessage";

function money(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

export default function WishlistPage() {
  const { user, loading: authLoading } = useAuth();
  const { remove: removeWishlistId } = useWishlist();
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    try {
      const result = await apiFetch("/wishlist");
      setItems(result.data || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?next=/wishlist");
      return;
    }
    load();
  }, [authLoading, user, router]);

  async function remove(productId) {
    setBusyId(productId);
    setMessage("");
    try {
      await apiFetch(`/wishlist/${productId}`, { method: "DELETE" });
      setItems((current) => current.filter((item) => item.product?._id !== productId));
      removeWishlistId(productId);
      setMessage("Removed from wishlist.");
    } finally {
      setBusyId("");
    }
  }

  async function addToCart(product) {
    if (product?.type === "live_course") {
      router.push(productHref(product));
      return;
    }
    setBusyId(product._id);
    setMessage("");
    try {
      await apiFetch("/cart/items", {
        method: "POST",
        body: JSON.stringify({ productId: product._id }),
      });
      window.dispatchEvent(new Event("lc-cart-changed"));
      setMessage(`${product.title} added to cart.`);
    } catch (error) {
      if (error.code === "PRODUCT_ALREADY_IN_CART") {
        router.push("/checkout");
        return;
      }
      setMessage(error.message || "Could not add the product to cart.");
    } finally {
      setBusyId("");
    }
  }

  if (authLoading || loading || !user) {
    return <section className="section"><div className="container"><p>Loading wishlist...</p></div></section>;
  }

  return (
    <>
      <section className="page-hero"><div className="container"><span className="ey">ACCOUNT</span><h1>Wishlist</h1><p>Products you saved for later.</p></div></section>
      <section className="section"><div className="container">
        <FlashMessage type="success">{message}</FlashMessage>
        {!items.length ? (
          <div className="empty-state-card">
            <div className="empty-state-icon">♡</div>
            <h2>Your wishlist is empty</h2>
            <p>Save courses and digital products you want to revisit later.</p>
            <Link className="btn" href="/courses">Explore Courses</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {items.map((item) => {
              const product = item.product;
              if (!product) return null;
              return (
                <article className="wishlist-card" key={item._id}>
                  <Link href={productHref(product)} className="wishlist-thumb-wrap">
                    <img className="wishlist-thumb" src={product.thumbnail || "/assets/course-thumb.jpg"} alt={product.title || "Product"} />
                  </Link>
                  <div className="wishlist-card-body">
                    <span className="product-type-label">{String(product.type || "product").replaceAll("_", " ")}</span>
                    <Link href={productHref(product)}><h2>{product.title}</h2></Link>
                    <p>{product.shortDescription || "Open this product to view full details."}</p>
                    <div className="wishlist-price">{product.isFree ? "Free" : money(currentPrice(product))}</div>
                    <div className="wishlist-actions">
                      <button className="btn" type="button" onClick={() => addToCart(product)} disabled={busyId === product._id}>
                        {product.type === "live_course" ? "Choose Batch" : "Add to Cart"}
                      </button>
                      <Link className="btn ghost" href={productHref(product)}>Details</Link>
                      <button className="link-danger" type="button" onClick={() => remove(product._id)} disabled={busyId === product._id}>Remove</button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div></section>
    </>
  );
}
