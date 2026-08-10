interface Section {
  heading: string;
  body: string;
}

export default function LegalPage({ title, updated, sections }: { title: string; updated: string; sections: Section[] }) {
  return (
    <div className="max-w-3xl mx-auto px-4 mt-10">
      <h1 className="text-3xl font-extrabold text-coast-navy border-l-4 border-coast-red pl-3 mb-2">{title}</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: {updated}</p>
      <div className="bg-white rounded-2xl shadow-sm p-8 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-bold text-coast-navy text-lg mb-2">{s.heading}</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
