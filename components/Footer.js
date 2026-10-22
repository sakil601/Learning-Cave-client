import Link from "next/link";

export default function Footer() {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <h4>Contact Us</h4>
          <p>10:00am – 10:00pm</p>
          <p>01630-125272, 01763-235959</p>
          <p>Damurhuda, Chuadanga</p>
          <p>support@learningcave.com.bd</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <Link href="/courses">All Services</Link>
          <Link href="/tips">Tips and Tricks</Link>
          <Link href="/faqs">FAQs</Link>
        </div>
        <div>
          <h4>Policies</h4>
          <Link href="/refund-policy">Refund & Exchange Policy</Link>
          <Link href="/payment-pricing">Payment & Pricing</Link>
          <Link href="/privacy-policy">Privacy Policy</Link>
          <Link href="/terms-conditions">Terms & Conditions</Link>
          <Link href="/order-cancellation">Order & Cancellation</Link>
        </div>
        <div>
          <h4>Information</h4>
          <Link href="/about-us">About Us</Link>
          <Link href="/payment-info">Payment Info</Link>
        </div>
      </div>
      <div className="footer-bottom">© 2026 Learning Cave</div>
    </footer>
  );
}
