"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const passwordsMatch = useMemo(
    () => !form.confirmPassword || form.password === form.confirmPassword,
    [form.password, form.confirmPassword],
  );

  async function submit(event) {
    event.preventDefault();
    setError("");
    setMessage("");
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      const result = await register(form);
      if (form.role === "instructor") {
        setMessage(result?.message || "Registration successful. Instructor approval is required before login.");
      } else {
        router.push("/login?registered=1");
      }
    } catch (err) {
      setError(err.message || "Registration failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="auth-shell auth-shell-v2">
      <div className="auth-card auth-card-v2">
        <div className="auth-heading">
          <span className="ey">JOIN LEARNING CAVE</span>
          <h1>Create Account</h1>
          <p>Choose how you want to use Learning Cave.</p>
        </div>

        <div className="role-selector" role="group" aria-label="Account type">
          <button type="button" className={form.role === "student" ? "active" : ""} onClick={() => setForm((x) => ({ ...x, role: "student" }))}>
            <strong>Student</strong><span>Learn, purchase and track progress.</span>
          </button>
          <button type="button" className={form.role === "instructor" ? "active" : ""} onClick={() => setForm((x) => ({ ...x, role: "instructor" }))}>
            <strong>Instructor</strong><span>Apply to teach on Learning Cave.</span>
          </button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          <label>Full name<input placeholder="Your full name" value={form.name} onChange={(e) => setForm((x) => ({ ...x, name: e.target.value }))} required minLength={2} /></label>
          <label>Email<input type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm((x) => ({ ...x, email: e.target.value }))} required /></label>
          <label>Phone<input placeholder="Phone number" value={form.phone} onChange={(e) => setForm((x) => ({ ...x, phone: e.target.value }))} required minLength={6} /></label>
          <label>Password<input type="password" placeholder="Minimum 8 characters" value={form.password} onChange={(e) => setForm((x) => ({ ...x, password: e.target.value }))} required minLength={8} /></label>
          <label>Confirm password<input className={!passwordsMatch ? "input-error" : ""} type="password" placeholder="Repeat your password" value={form.confirmPassword} onChange={(e) => setForm((x) => ({ ...x, confirmPassword: e.target.value }))} required minLength={8} /></label>
          {!passwordsMatch && <small className="auth-error">Passwords do not match.</small>}
          {form.role === "instructor" && <div className="auth-note">Instructor accounts require admin approval before they can sign in.</div>}
          <button className="btn" disabled={busy || !passwordsMatch}>{busy ? "Creating account..." : "Create Account"}</button>
          {error && <div className="auth-error">{error}</div>}
          {message && <div className="auth-success">{message}</div>}
        </form>
        <p className="auth-footer-text">Already registered? <Link href="/login">Login</Link></p>
      </div>
    </section>
  );
}
