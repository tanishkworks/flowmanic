import Image from 'next/image';
import Link from 'next/link';

export type TeamMember = {
  name: string;
  role: string;
  badge: string;
  email: string;
  linkedin: string;
  bio: string;
  initials: string;
  accent: string;
  photo: string;
};

export const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Tanishk Dhakad',
    role: 'Director',
    badge: 'Leadership & Automation Architecture',
    email: 'tanishk@flowmanic.tech',
    linkedin: 'https://www.linkedin.com/in/tanishk-dhakad/',
    bio: "Leading Flowmanic's AI-first automation ecosystem—architecting custom n8n workflows, autonomous AI agents, and scalable operational systems that put digital and marketing agencies on autopilot.",
    initials: 'TD',
    accent: '#0B54F7',
    photo: '/team/tanishk-dhakad.jpg',
  },
  {
    name: 'Palak Dubey',
    role: 'Web Designer',
    badge: 'Creative & Web Architecture',
    email: 'palak@flowmanic.tech',
    linkedin: 'https://www.linkedin.com/in/palakdubey0306/',
    bio: 'Crafting high-converting web architectures, interactive user experiences, and cohesive visual systems that blend modern digital aesthetics with seamless automated execution.',
    initials: 'PD',
    accent: '#8B5CF6',
    photo: '/team/palak-dubey.jpg',
  },
];

export function TeamSection() {
  return (
    <section className="section section--flush-top" id="team">
      <div className="wrap">
        <div className="head" data-reveal>
          <p className="label">[ OUR DIGITAL ARCHITECTS ]</p>
          <h2 className="h2">The Minds Behind The Autopilot.</h2>
          <p className="lead">
            We combine deep automation engineering with precision web design to eliminate agency bottlenecks.
          </p>
        </div>

        <div className="team-grid" data-stagger>
          {TEAM_MEMBERS.map((member) => (
            <article className="team-card" key={member.name}>
              <div className="team-card-glow" style={{ '--card-accent': member.accent } as React.CSSProperties} />
              
              <div className="team-card-header">
                <span className="team-badge">{member.badge}</span>
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-in-btn"
                  aria-label={`${member.name} on LinkedIn`}
                  title={`Connect with ${member.name} on LinkedIn`}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.78a1.6 1.6 0 0 0-1.6 1.6 1.6 1.6 0 0 0 1.6 1.6 1.6 1.6 0 0 0 1.6-1.6 1.6 1.6 0 0 0-1.6-1.6Z" />
                  </svg>
                  <span>IN</span>
                </a>
              </div>

              <div className="team-avatar-row">
                <div className="team-avatar" style={{ '--av-accent': member.accent } as React.CSSProperties}>
                  <div className="team-avatar-frame">
                    {member.photo ? (
                      <Image
                        src={member.photo}
                        alt={`${member.name} — ${member.role} at Flowmanic`}
                        width={80}
                        height={80}
                        className="team-avatar-img"
                        priority
                      />
                    ) : (
                      <span className="team-initials">{member.initials}</span>
                    )}
                  </div>
                  <span className="team-pulse" />
                </div>
                <div className="team-identity">
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                  <a className="team-email-link" href={`mailto:${member.email}`}>
                    {member.email}
                  </a>
                </div>
              </div>

              <p className="team-bio">{member.bio}</p>

              <div className="team-foot">
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="team-connect-btn"
                >
                  Connect on LinkedIn ↗
                </a>
                <a href={`mailto:${member.email}`} className="team-email-btn">
                  Email Direct →
                </a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
