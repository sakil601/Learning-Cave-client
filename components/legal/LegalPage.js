import { notFound } from 'next/navigation';
import { getSiteData } from '@/lib/site-data';

export default async function LegalPage({ slug }) {
  const d = await getSiteData();
  const p = d.legalPages?.find((x) => x.slug === slug);
  if (!p) notFound();

  return (
    <section className="section">
      <div className="container prose">
        <span className="ey">INFORMATION</span>
        <h1>{p.title}</h1>
        {String(p.content || '')
          .split('\n\n')
          .map((x, i) => <p key={i}>{x}</p>)}
      </div>
    </section>
  );
}
