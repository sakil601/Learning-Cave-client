import Link from "next/link";
export default function NotFound(){return <section className="section"><div className="container" style={{maxWidth:760,textAlign:"center"}}><span className="ey">404</span><h1>Page not found</h1><p>The page or product you requested is not available.</p><Link className="btn" href="/">Back to Home</Link></div></section>}
