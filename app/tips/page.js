import { TIPS } from "@/lib/static-content";
export const metadata = { title: "Tips and Tricks" };
export default function Page() {
  return <><section className="tips-hero"><div className="container"><span className="ey">TIPS AND TRICKS</span><h1>Learn something useful in a few minutes.</h1><p>Static practical tips for now, following the V57 demo.</p></div></section><section className="section tip-feed"><div className="container">{TIPS.map((tip, index) => <article className="tip-post" key={tip.slug}><div className="tip-date">TIP {String(index + 1).padStart(2, "0")}</div><div className="tip-thumb"><img src={tip.image} alt={tip.title} /></div><div className="tip-content"><h2>{tip.title}</h2><p>{tip.excerpt}</p></div></article>)}</div></section></>;
}
