import Link from "next/link";

export default async function PaymentInfoPage({ searchParams }) {
  const params = await searchParams;
  return (
    <section className="section payment-state-section">
      <div className="container payment-state-card pending">
        <div className="payment-state-icon">⌛</div>
        <span className="ey">MANUAL PAYMENT</span>
        <h1>Payment submitted for verification</h1>
        <p>Your manual payment request has been created. Access will be granted after an admin verifies the payment.</p>
        {params?.order && <div className="payment-reference"><span>Order ID</span><strong>{params.order}</strong></div>}
        {params?.payment && <div className="payment-reference"><span>Payment ID</span><strong>{params.payment}</strong></div>}
        <div className="page-actions payment-actions">
          <Link className="btn" href="/dashboard">Go to Dashboard</Link>
          <Link className="btn ghost" href="/courses">Browse More Courses</Link>
        </div>
      </div>
    </section>
  );
}
