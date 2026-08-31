import ItemCard from "./ItemCard";
export default function SectionGrid({ section }) {
  return (
    <section className="section">
      <div className="container">
        <span className="ey">{section.eyebrow || section.label}</span>
        <h2>{section.heading || section.label}</h2>
        {section.groups?.map((g) => (
          <div className="group-block" key={g.name}>
            <h3>{g.name}</h3>
            {g.subgroups?.map((sg) => (
              <div key={sg.name}>
                <h4>{sg.name}</h4>
                <div className="service-grid">
                  {sg.items
                    ?.filter((i) => i.active !== false)
                    .map((i) => (
                      <ItemCard key={i.slug} item={i} section={section.slug} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
