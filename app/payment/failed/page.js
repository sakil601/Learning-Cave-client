import Link from "next/link";
export default function Page() {
  return <section className="section payment-state-section"><div className="container payment-state-card failed"><div className="payment-state-icon">!</div><span className="ey">PAYMENT</span><h1>Payment Failed</h1><p>Your payment could not be completed. No access has been granted.</p><div className="page-actions payment-actions"><Link className="btn" href="/checkout">Try Again</Link><Link className="btn ghost" href="/">Home</Link></div></div></section>;
}
