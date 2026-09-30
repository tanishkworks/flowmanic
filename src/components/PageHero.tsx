import FitDisplay from './FitDisplay';
import TrailLayer from './TrailLayer';

type Props = {
  top: string;
  bottom: string;
  meta: string[];
  title: string;
  size?: 'full' | 'tall';
  next?: string;
};

/** The video's hero: two-line display (solid + outline), cursor image trail, meta bottom-left, scroll cue bottom-right. */
export default function PageHero({ top, bottom, meta, title, size = 'full', next }: Props) {
  return (
    <section className={`hero hero--${size}`} data-trail>
      <TrailLayer />
      <FitDisplay
        as="h1"
        className="hero-title"
        frac={0.665}
        fracSm={0.9}
        srText={title}
        masked
        lines={[{ text: top }, { text: bottom, outline: true }]}
      />
      <p className="hero-meta">
        {meta.map((m, i) => (
          <span key={i}>
            {m}
            <br />
          </span>
        ))}
      </p>
      {next ? (
        <a className="hero-scroll" href={next}>
          Scroll to explore <span className="scroll-line" />
        </a>
      ) : null}
    </section>
  );
}
