import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectData {
  name: string;
  image: string;
  description?: string;
  media?: string[];
  videos?: string[];
}

interface ProjectOverlayProps {
  project: ProjectData | null;
  onClose: () => void;
}

const PROJECT_DETAILS: Record<string, { description: string; tags: string[]; year: string; role: string; videos?: string[] }> = {
  'Pulse': {
    description: `A mobile application created for the Swift Student Challenge, designed to support users during moments of stress and anxiety. The app provides guided breathing exercises, meditation sessions, and calming audio tools through an accessible and intuitive interface. The project focused heavily on smooth user interaction, emotional-centered design, and performance optimization.`,
    tags: ['SwiftUI'],
    year: '2026',
    role: 'Mobile Developer',
    videos: ['https://vimeo.com/1191005527?fl=tl&fe=ec'],
  },
  'Fraud Fishing': {
    description: `A full-stack platform built to help users detect and report fraudulent websites through a simple and intuitive experience. The project includes an iOS application for submitting reports and a web dashboard for reviewing and visualizing reported data. I worked on API development, client-server communication, and creating clean interfaces focused on usability and efficiency.`,
    tags: ['SwiftUI', 'Node.js', 'NestJS', 'MySQL'],
    year: '2025',
    role: 'Full-stack Developer',
    videos: ['https://vimeo.com/1191001595?fl=tl&fe=ec'],
  },
  'MedSync': {
    description: `A full-stack medical workflow and patient management system currently in development. The platform is designed to streamline medical data handling through RESTful APIs and modern frontend architecture. My focus has been on backend API design, HTTP communication, and building user-friendly interfaces that prioritize clarity and usability.`,
    tags: ['React Native', 'Expo', 'React', 'Java', 'Quarkus', 'MySQL'],
    year: '2026',
    role: 'Full-stack Developer',
    videos: ['https://vimeo.com/1191724675?fl=tl&fe=ec'],
  },
  'Firewall Defenders': {
    description: `A Tower Defense project developed in Unity alongside a telemetry and analytics dashboard. The system collects player behavior data in real time and displays engagement metrics through an interactive web interface. I contributed to gameplay systems, backend APIs, and the React dashboard focused on data visualization and user insights.`,
    tags: ['Unity', 'C#', 'Node.js', 'MySQL', 'React', 'WebGL'],
    year: '2025',
    role: 'Game Developer & Full-stack Developer',
    videos: [
      'https://vimeo.com/1191007660?fl=tl&fe=ec',
      'https://vimeo.com/1191418535?fl=tl&fe=ec'
    ],
  },
  "ddplata's portfolio": {
    description: `A personal portfolio site for Danna Miranda (ddplata), an industrial designer. She wanted a portfolio that reflected her personality and style, but not just a simple page with photos and descriptions. Even thought she opted for a simple but not quite minimalist approach, I managed to create a unique experience through the use of 3D elements and animations that made the site stand out and feel original.`,
    tags: ['Next.js', 'Three.js', 'React', 'Tailwind', 'Vercel'],
    year: '2026',
    role: 'Frontend Developer & Designer',
    videos: ['https://vimeo.com/1191418577?fl=tl&fe=ec'],
  },
};

export default function ProjectOverlay({ project, onClose }: ProjectOverlayProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = useState({ top: true, bottom: false });

  const details = project ? (PROJECT_DETAILS[project.name] ?? {
    description: 'Project details coming soon.',
    tags: [],
    year: '—',
    role: '—',
  }) : null;

  // Track scroll position to show/hide fade edges
  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const atTop = el.scrollTop < 8;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    setScrollState({ top: atTop, bottom: atBottom });
  };

  // Reset scroll when project changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setScrollState({ top: true, bottom: false });
    }
  }, [project]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          key="project-overlay"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '55%',
            height: '100%',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            pointerEvents: 'auto',
          }}
        >
          {/* Glassmorphism panel */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(1,6,38,0.82) 0%, rgba(20,10,60,0.78) 100%)',
              backdropFilter: 'blur(22px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(22px) saturate(1.4)',
              borderLeft: '1px solid rgba(180,151,207,0.18)',
              boxShadow: '-8px 0 48px rgba(0,0,0,0.45)',
            }}
          />

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close project details"
            style={{
              position: 'absolute',
              top: 24,
              right: 28,
              zIndex: 10,
              background: 'rgba(180,151,207,0.12)',
              border: '1px solid rgba(180,151,207,0.28)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#B497CF',
              fontSize: 18,
              transition: 'background 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(180,151,207,0.25)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(90deg)';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(180,151,207,0.12)';
              (e.currentTarget as HTMLButtonElement).style.transform = 'rotate(0deg)';
            }}
          >
            ✕
          </button>

          {/* Scrollable content wrapper with fade masks */}
          <div style={{ position: 'relative', flex: 1, overflow: 'hidden' }}>

            {/* Top fade */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 80,
                background: 'linear-gradient(to bottom, rgba(1,6,38,0.92) 0%, transparent 100%)',
                zIndex: 5,
                pointerEvents: 'none',
                opacity: scrollState.top ? 0 : 1,
                transition: 'opacity 0.3s ease',
              }}
            />

            {/* Bottom fade */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                background: 'linear-gradient(to top, rgba(1,6,38,0.92) 0%, transparent 100%)',
                zIndex: 5,
                pointerEvents: 'none',
                opacity: scrollState.bottom ? 0 : 1,
                transition: 'opacity 0.3s ease',
              }}
            />

            {/* Actual scrollable content */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              style={{
                position: 'relative',
                zIndex: 1,
                height: '100%',
                overflowY: 'auto',
                overflowX: 'hidden',
                padding: '56px 40px 60px 44px',
                scrollbarWidth: 'none',
              }}
            >
              {/* ── Project name ── */}
              <motion.div
                key={project.name + '-name'}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05, duration: 0.4 }}
              >
                <p style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '0.72rem',
                  letterSpacing: '0.18em',
                  color: '#B497CF',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                  opacity: 0.8,
                }}>
                  {details?.year} · {details?.role}
                </p>
                <h2 style={{
                  fontFamily: 'Azonix, sans-serif',
                  fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
                  color: '#f8f8ff',
                  letterSpacing: '0.04em',
                  lineHeight: 1.15,
                  marginBottom: 20,
                }}>
                  {project.name}
                </h2>
              </motion.div>

              {/* ── Tags ── */}
              <motion.div
                key={project.name + '-tags'}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.4 }}
                style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}
              >
                {details?.tags.map(tag => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: "'Fira Code', monospace",
                      fontSize: '0.7rem',
                      letterSpacing: '0.06em',
                      color: '#B497CF',
                      background: 'rgba(180,151,207,0.1)',
                      border: '1px solid rgba(180,151,207,0.25)',
                      borderRadius: 20,
                      padding: '4px 12px',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </motion.div>

              {/* ── Divider ── */}
              <div style={{
                width: '100%',
                height: 1,
                background: 'linear-gradient(to right, rgba(180,151,207,0.3), transparent)',
                marginBottom: 28,
              }} />

              {/* ── Description ── */}
              <motion.div
                key={project.name + '-desc'}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18, duration: 0.45 }}
              >
                <p style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  color: '#B497CF',
                  textTransform: 'uppercase',
                  marginBottom: 14,
                  opacity: 0.7,
                }}>
                  About
                </p>
                {details?.description.split('\n\n').map((para, i) => (
                  <p key={i} style={{
                    fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif',
                    fontSize: 'clamp(0.88rem, 1.4vw, 1rem)',
                    lineHeight: 1.75,
                    color: 'rgba(248,248,255,0.82)',
                    marginBottom: 16,
                    fontWeight: 300,
                  }}>
                    {para.trim()}
                  </p>
                ))}
              </motion.div>

              {/* ── Divider ── */}
              <div style={{
                width: '100%',
                height: 1,
                background: 'linear-gradient(to right, rgba(180,151,207,0.3), transparent)',
                margin: '32px 0 28px',
              }} />

              {/* ── Media section ── */}
              <motion.div
                key={project.name + '-media'}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.26, duration: 0.45 }}
              >
                <p style={{
                  fontFamily: "'Fira Code', monospace",
                  fontSize: '0.72rem',
                  letterSpacing: '0.14em',
                  color: '#B497CF',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                  opacity: 0.7,
                }}>
                  Gallery & Media
                </p>

                {/* Videos */}
                {details?.videos && details.videos.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 24 }}>
                    {details.videos.map((videoUrl, idx) => {
                      const vimeoId = videoUrl.split('vimeo.com/')[1]?.split('?')[0];
                      if (!vimeoId) return null;
                      return (
                        <div key={idx} style={{
                          width: '100%',
                          aspectRatio: '16/9',
                          borderRadius: 12,
                          overflow: 'hidden',
                          border: '1px solid rgba(180,151,207,0.15)',
                          boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                        }}>
                          <iframe
                            src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                            frameBorder="0"
                            allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                            style={{ width: '100%', height: '100%' }}
                            title={`${project.name} video ${idx + 1}`}
                          ></iframe>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Main preview image 
                <div style={{
                  width: '100%',
                  borderRadius: 12,
                  overflow: 'hidden',
                  border: '1px solid rgba(180,151,207,0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                }}>
                  <img
                    src={project.image}
                    alt={project.name}
                    style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                  />
                </div>*/}
              </motion.div>

              {/* Bottom spacer */}
              <div style={{ height: 120 }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
