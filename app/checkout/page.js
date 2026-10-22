"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { useAuth } from "@/components/AuthProvider";
import FlashMessage from "@/components/FlashMessage";

const emptyCart = { items: [], subtotal: 0 };

function money(value) {
  return `৳${Number(value || 0).toLocaleString("en-BD")}`;
}

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState(emptyCart);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    couponCode: "",
    method: "sslcommerz",
    transactionId: "",
    agree: false,
  });
  const [coupon, setCoupon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [couponBusy, setCouponBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  async function loadCart() {
    const result = await apiFetch("/cart");
    setCart(result.data || emptyCart);
  }

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?next=/checkout");
      return;
    }

    setForm((current) => ({
      ...current,
      name: current.name || user.name || "",
      email: current.email || user.email || "",
      phone: current.phone || user.phone || "",
    }));

    loadCart()
      .catch((error) => {
        setMessageType("error");
        setMessage(error.message || "Could not load your cart.");
      })
      .finally(() => setLoading(false));
  }, [authLoading, user, router]);

  const total = coupon?.total ?? cart.subtotal ?? 0;
  const discount = coupon?.discountAmount ?? 0;

  const couponItems = useMemo(
    () =>
      cart.items.map((item) => ({
        product: item.product?._id,
        productType: item.product?.type,
        lineTotal: Number(item.price || 0),
        batch: item.batch?._id || undefined,
      })),
    [cart.items],
  );

  async function remove(itemId) {
    setMessage("");
    try {
      await apiFetch(`/cart/items/${itemId}`, { method: "DELETE" });
      await loadCart();
      setCoupon(null);
      setForm((current) => ({ ...current, couponCode: "" }));
      window.dispatchEvent(new Event("lc-cart-changed"));
      setMessageType("success");
      setMessage("Item removed from your cart.");
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Could not remove the item.");
    }
  }

  async function applyCoupon() {
    const code = form.couponCode.trim();
    if (!code) {
      setCoupon(null);
      setMessageType("error");
      setMessage("Enter a coupon code first.");
      return;
    }

    setCouponBusy(true);
    setMessage("");
    try {
      const result = await apiFetch("/coupons/validate", {
        method: "POST",
        body: JSON.stringify({
          code,
          items: couponItems,
          subtotal: Number(cart.subtotal || 0),
        }),
      });
      setCoupon(result.data || null);
      setMessageType("success");
      setMessage(result.message || "Coupon applied successfully.");
    } catch (error) {
      setCoupon(null);
      setMessageType("error");
      setMessage(error.message || "Coupon could not be applied.");
    } finally {
      setCouponBusy(false);
    }
  }

  function clearCoupon() {
    setCoupon(null);
    setForm((current) => ({ ...current, couponCode: "" }));
    setMessage("");
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.agree) {
      setMessageType("error");
      setMessage("Please accept the Terms & Conditions and Refund Policy.");
      return;
    }
    if (form.method === "manual" && !form.transactionId.trim()) {
      setMessageType("error");
      setMessage("Enter the manual payment transaction ID.");
      return;
    }

    setBusy(true);
    setMessage("");
    try {
      const orderResult = await apiFetch("/orders/from-cart", {
        method: "POST",
        body: JSON.stringify({
          billing: {
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
          },
          ...(form.couponCode.trim()
            ? { couponCode: form.couponCode.trim().toUpperCase() }
            : {}),
        }),
      });

      const order = orderResult.data;

      if (form.method === "sslcommerz") {
        const payment = await apiFetch("/payments/sslcommerz/initiate", {
          method: "POST",
          body: JSON.stringify({ orderId: order._id }),
        });
        if (!payment?.data?.gatewayUrl) {
          throw new Error("Payment gateway URL was not returned.");
        }
        window.location.assign(payment.data.gatewayUrl);
        return;
      }

      const payment = await apiFetch("/payments", {
        method: "POST",
        body: JSON.stringify({
          orderId: order._id,
          method: "manual",
          transactionId: form.transactionId.trim(),
        }),
      });

      window.dispatchEvent(new Event("lc-cart-changed"));
      router.push(
        `/payment-info?order=${encodeURIComponent(order._id)}&payment=${encodeURIComponent(payment.data?._id || "")}`,
      );
    } catch (error) {
      setMessageType("error");
      setMessage(error.message || "Checkout failed.");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading || !user) {
    return (
      <section className="section">
        <div className="container"><p>Loading checkout...</p></div>
      </section>
    );
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="ey">CHECKOUT</span>
          <h1>Complete your order</h1>
          <p>Review your cart, apply a coupon and choose your payment method.</p>
        </div>
      </section>

      <section className="section">
        <div className="container checkout-layout-v2">
          <div className="checkout-box">
            {!cart.items.length ? (
              <div className="empty-state-card">
                <div className="empty-state-icon">🛒</div>
                <h2>Your cart is empty</h2>
                <p>Add a course or product before continuing to checkout.</p>
                <Link className="btn" href="/courses">Browse Courses</Link>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="checkout-section-head">
                  <div>
                    <span className="ey">YOUR CART</span>
                    <h2>{cart.items.length} item{cart.items.length === 1 ? "" : "s"}</h2>
                  </div>
                </div>

                <div className="checkout-cart-list">
                  {cart.items.map((item) => (
                    <div className="checkout-cart-item" key={item._id}>
                      <img
                        src={item.product?.thumbnail || "/assets/course-thumb.jpg"}
                        alt=""
                        className="checkout-cart-thumb"
                      />
                      <div className="checkout-cart-info">
                        <strong>{item.product?.title}</strong>
                        <span>{String(item.product?.type || "product").replaceAll("_", " ")}</span>
                        {item.batch?.name && <small>Batch: {item.batch.name}</small>}
                      </div>
                      <div className="checkout-cart-price">
                        <strong>{money(item.price)}</strong>
                        <button type="button" className="link-danger" onClick={() => remove(item._id)}>Remove</button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout-form-section">
                  <h3>Billing information</h3>
                  <div className="form-grid">
                    <label>Full name<input placeholder="Name" value={form.name} onChange={(e) => setForm((x) => ({ ...x, name: e.target.value }))} required /></label>
                    <label>Email<input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((x) => ({ ...x, email: e.target.value }))} required /></label>
                    <label>Phone<input placeholder="Phone" value={form.phone} onChange={(e) => setForm((x) => ({ ...x, phone: e.target.value }))} required /></label>
                  </div>
                </div>

                <div className="checkout-form-section">
                  <h3>Payment method</h3>
                  <div className="payment-options">
                    <label className={`payment-option${form.method === "sslcommerz" ? " active" : ""}`}>
                      <input type="radio" name="pm" checked={form.method === "sslcommerz"} onChange={() => setForm((x) => ({ ...x, method: "sslcommerz" }))} />
                      <span><strong>Online Payment</strong><small>Pay securely through SSLCommerz.</small></span>
                    </label>
                    <label className={`payment-option${form.method === "manual" ? " active" : ""}`}>
                      <input type="radio" name="pm" checked={form.method === "manual"} onChange={() => setForm((x) => ({ ...x, method: "manual" }))} />
                      <span><strong>Manual Payment</strong><small>Submit your transaction ID for admin verification.</small></span>
                    </label>
                  </div>
                  {form.method === "manual" && (
                    <div className="manual-payment-panel">
                      <p>Complete the manual transfer first, then enter the transaction ID below.</p>
                      <input placeholder="Transaction ID" value={form.transactionId} onChange={(e) => setForm((x) => ({ ...x, transactionId: e.target.value }))} required />
                    </div>
                  )}
                </div>

                <label className="tc-row">
                  <input type="checkbox" checked={form.agree} onChange={(e) => setForm((x) => ({ ...x, agree: e.target.checked }))} />
                  <span>I agree to the <Link href="/terms-conditions">Terms & Conditions</Link> and <Link href="/refund-policy">Refund Policy</Link>.</span>
                </label>

                <button className="btn full" disabled={busy || !cart.items.length}>
                  {busy ? "Processing..." : form.method === "sslcommerz" ? `Pay ${money(total)}` : "Submit Manual Payment"}
                </button>
                <FlashMessage type={messageType}>{message}</FlashMessage>
              </form>
            )}
          </div>

          {!!cart.items.length && (
            <aside className="checkout-summary-card">
              <span className="ey">ORDER SUMMARY</span>
              <div className="summary-row"><span>Subtotal</span><strong>{money(cart.subtotal)}</strong></div>

              <div className="coupon-panel">
                <label>Coupon code</label>
                <div className="coupon-row">
                  <input
                    placeholder="e.g. EXCEL20"
                    value={form.couponCode}
                    onChange={(e) => {
                      setForm((x) => ({ ...x, couponCode: e.target.value.toUpperCase() }));
                      if (coupon) setCoupon(null);
                    }}
                  />
                  {coupon ? (
                    <button type="button" className="btn ghost" onClick={clearCoupon}>Remove</button>
                  ) : (
                    <button type="button" className="btn ghost" onClick={applyCoupon} disabled={couponBusy}>{couponBusy ? "Applying..." : "Apply"}</button>
                  )}
                </div>
                {coupon && <small className="coupon-success">{coupon.coupon?.code} applied</small>}
              </div>

              {discount > 0 && <div className="summary-row discount"><span>Discount</span><strong>-{money(discount)}</strong></div>}
              <div className="summary-row total"><span>Total</span><strong>{money(total)}</strong></div>
              <p className="checkout-security-note">Your final amount is recalculated by the server before payment.</p>
            </aside>
          )}
        </div>
      </section>
    </>
  );
}
