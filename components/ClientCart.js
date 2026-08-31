"use client";
import { useEffect, useState } from "react";
export function AddToCart({ item }) {
  const add = () => {
    const cart = JSON.parse(localStorage.getItem("lc_cart") || "[]");
    if (!cart.some((x) => x.slug === item.slug)) cart.push(item);
    localStorage.setItem("lc_cart", JSON.stringify(cart));
    location.href = "/checkout";
  };
  return (
    <button className="btn primary" onClick={add}>
      Order Now
    </button>
  );
}
export function CheckoutForm({ items }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    method: "bKash",
    account: "",
    transactionId: "",
  });
  const [msg, setMsg] = useState("");
  const total = items.reduce((a, x) => a + (x.price - x.discount), 0);
  async function submit(e) {
    e.preventDefault();
    setMsg("Submitting...");
    const r = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, items, total }),
    });
    const j = await r.json();
    setMsg(j.message || "Order submitted");
    if (r.ok) localStorage.removeItem("lc_cart");
  }
  return (
    <form className="checkout-form" onSubmit={submit}>
      {["name", "phone", "email", "account", "transactionId"].map((k) => (
        <input
          key={k}
          required={k !== "email"}
          type={k === "email" ? "email" : "text"}
          placeholder={k}
          value={form[k]}
          onChange={(e) => setForm({ ...form, [k]: e.target.value })}
        />
      ))}
      <select
        value={form.method}
        onChange={(e) => setForm({ ...form, method: e.target.value })}
      >
        <option>bKash</option>
        <option>Nagad</option>
        <option>Rocket</option>
        <option>Bank Transfer</option>
      </select>
      <button className="btn primary" type="submit">
        Submit Order
      </button>
      {msg && <p>{msg}</p>}
    </form>
  );
}
