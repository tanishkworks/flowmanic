export function AboutNarrative() {
  const chapters = [
    {
      num: '01.01',
      tag: 'CHAPTER 01.01',
      title: 'The Problem We Saw',
      body: 'Marketing and digital agencies were losing dozens of hours every week manually compiling client performance reports, chasing inbound leads across spreadsheets, and repurposing content by hand. High-value strategists were trapped doing low-value administrative busywork.',
    },
    {
      num: '01.02',
      tag: 'CHAPTER 01.02',
      title: 'Why We Started Flowmanic',
      body: 'Founded by Tanishk Dhakad alongside Palak Dubey, Flowmanic was created to replace fragile manual agency routines with custom, production-ready n8n and AI automation systems that run reliably in your own environment—with zero platform lock-in.',
    },
    {
      num: '01.03',
      tag: 'CHAPTER 01.03',
      title: 'What We Build Today',
      body: 'Today, Flowmanic operates as a dedicated B2B automation and web architecture partner—engineering automated client reporting, instant AI lead triage, content repurposing engines, and conversion-focused agency web experiences that scale without added headcount.',
    },
  ];

  return (
    <section className="section section--flush-top" id="story">
      <div className="wrap">
        <div className="head" data-reveal>
          <p className="label">[ WHERE AI MEETS AUTONOMOUS EXECUTION ]</p>
          <h2 className="h2 story-headline">Flowmanic Was Never Meant To Be Ordinary.</h2>
          <p className="lead story-subheadline">
            Built at the intersection of AI agents, n8n workflow engineering, and high-converting web architecture,
            Flowmanic helps marketing and digital agencies move beyond manual busywork and fragmented tools.
          </p>
        </div>

        <div className="narrative-grid" data-stagger>
          {chapters.map((chap) => (
            <article className="narrative-card" key={chap.num}>
              <div className="narrative-top">
                <span className="narrative-tag">{chap.tag}</span>
                <span className="narrative-num" aria-hidden="true">
                  {chap.num}
                </span>
              </div>
              <h3 className="narrative-title">{chap.title}</h3>
              <p className="narrative-body">{chap.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
