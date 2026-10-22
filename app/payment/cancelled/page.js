import Link from "next/link";
export default function Page() {
  return <section className="section payment-state-section"><div className="container payment-state-card cancelled"><div className="payment-state-icon">×</div><span className="ey">PAYMENT</span><h1>Payment Cancelled</h1><p>The payment was cancelled. Your cart is still available so you can try again.</p><div className="page-actions payment-actions"><Link className="btn" href="/checkout">Return to Checkout</Link><Link className="btn ghost" href="/">Home</Link></div></div></section>;
}
