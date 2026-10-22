import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <Suspense fallback={<section className="auth-shell"><div className="auth-card"><p>Loading...</p></div></section>}>
      <LoginForm />
    </Suspense>
  );
}
