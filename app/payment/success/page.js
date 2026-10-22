import Link from "next/link";
export default async function Page({ searchParams }) {
  const params = await searchParams;
  return (
    <section className="section payment-state-section">
      <div className="container payment-state-card success">
        <div className="payment-state-icon">✓</div>
        <span className="ey">PAYMENT</span>
        <h1>Payment Successful</h1>
        <p>Your payment was verified and your purchased access has been granted.</p>
        {params?.order && <div className="payment-reference"><span>Order ID</span><strong>{params.order}</strong></div>}
        <div className="page-actions payment-actions"><Link className="btn" href="/dashboard">My Purchase</Link><Link className="btn ghost" href="/courses">Browse Courses</Link></div>
      </div>
    </section>
  );
}
