"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({ login: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const registered = searchParams.get("registered") === "1";

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const result = await login(form);
      const next = searchParams.get("next");
      const user = result?.data?.user;
      const fallback = user?.role === "admin" ? "/admin" : user?.role === "instructor" ? "/instructor" : "/dashboard";
      router.push(next || fallback);
      router.refresh();
    } catch (err) {
      setError(err.message || "Login failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-shell auth-shell-v2">
      <div className="auth-card auth-card-v2">
        <div className="auth-heading">
          <span className="ey">WELCOME BACK</span>
          <h1>Login</h1>
          <p>Continue learning with your Learning Cave account.</p>
        </div>
        {registered && <div className="auth-success auth-banner">Account created successfully. You can now log in.</div>}
        <form className="auth-form" onSubmit={submit}>
          <label>Email or phone<input type="text" placeholder="Email or phone" value={form.login} onChange={(e) => setForm((x) => ({ ...x, login: e.target.value }))} required autoComplete="username" /></label>
          <label>Password<input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((x) => ({ ...x, password: e.target.value }))} required autoComplete="current-password" /></label>
          <button className="btn" disabled={busy}>{busy ? "Logging in..." : "Login"}</button>
          {error && <div className="auth-error">{error}</div>}
        </form>
        <p className="auth-footer-text">New to Learning Cave? <Link href="/register">Create account</Link></p>
      </div>
    </section>
  );
}
