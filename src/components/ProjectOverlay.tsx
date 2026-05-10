import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface ProjectData {
  name: string;
  image: string;
  description?: string;
  media?: string[];
}

interface ProjectOverlayProps {
  project: ProjectData | null;
  onClose: () => void;
}

const PROJECT_DETAILS: Record<string, { description: string; tags: string[]; year: string; role: string }> = {
  'Pulse': {
    description: `Pulse is a real-time health monitoring platform designed to bring clarity to complex medical data. 
    It aggregates biometric signals from wearable devices and presents them through an intuitive, clinician-friendly dashboard.
    
    The platform supports multi-patient monitoring, smart alerting, and historical trend analysis. Built with scalability in mind, 
    Pulse handles thousands of concurrent data streams without sacrificing speed or accuracy.
    
    One of the core challenges was designing a system that could surface critical information at a glance while keeping 
    the interface uncluttered for everyday use. The result is a layered UI that reveals depth on demand.`,
    tags: ['React', 'Node.js', 'WebSocket', 'PostgreSQL', 'Docker'],
    year: '2024',
    role: 'Full-Stack Developer',
  },
  'Fraud Fishing': {
    description: `Fraud Fishing is a machine-learning-powered detection engine that identifies anomalous financial transactions 
    in real time. It was built to tackle the growing sophistication of fraud patterns that evade traditional rule-based systems.
    
    The model leverages behavioral fingerprinting, graph-based relationship analysis, and time-series anomaly detection 
    to flag suspicious activity with minimal false positives.
    
    The system integrates directly into payment pipelines and generates human-readable explanations for every alert, 
    enabling compliance teams to act quickly and confidently.`,
    tags: ['Python', 'TensorFlow', 'FastAPI', 'Redis', 'Kafka'],
    year: '2024',
    role: 'ML Engineer & Backend Developer',
  },
  'MedSync': {
    description: `MedSync is a cross-platform healthcare coordination app that bridges the gap between patients and their 
    care teams. It synchronizes appointments, medications, lab results, and messaging into a single, unified experience.
    
    Designed with accessibility in mind, the app supports voice navigation, large-text modes, and offline-first 
    functionality for low-connectivity environments.
    
    MedSync earned recognition for its onboarding flow, which guides first-time users through health profile setup 
    with empathy-driven copy and zero technical jargon.`,
    tags: ['React Native', 'Expo', 'Firebase', 'Quarkus', 'PostgreSQL'],
    year: '2025',
    role: 'Mobile & Backend Developer',
  },
  'Firewall Defenders': {
    description: `Firewall Defenders is a gamified cybersecurity training platform where players defend virtual networks 
    against escalating threat scenarios. Each level introduces new attack vectors — DDoS floods, phishing injections, 
    zero-day exploits — that must be neutralized using real security concepts.
    
    The game was designed to make cybersecurity education engaging and memorable, targeting both students and 
    corporate training programs. Scenario completion unlocks detailed post-mortems explaining the real-world 
    equivalents of each threat.`,
    tags: ['Unity', 'C#', 'Photon', 'Node.js', 'MongoDB'],
    year: '2023',
    role: 'Game Developer & System Designer',
  },
  "ddplata's portfolio": {
    description: `A personal portfolio site for ddplata, a multidisciplinary artist and digital creator. 
    The design language was intentionally raw and experimental — layered textures, glitch effects, and unconventional 
    grid layouts that reflect the artist's boundary-pushing aesthetic.
    
    The site features a custom CMS that allows the artist to update galleries, write blog posts, and manage 
    commission requests without touching code. Performance was a core constraint, with all animations 
    hardware-accelerated and images served via adaptive formats.`,
    tags: ['Next.js', 'Three.js', 'GSAP', 'Sanity CMS', 'Vercel'],
    year: '2024',
    role: 'Frontend Developer & Designer',
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

                {/* Main preview image */}
                <div style={{
                  width: '100%',
                  borderRadius: 12,
                  overflow: 'hidden',
                  marginBottom: 12,
                  border: '1px solid rgba(180,151,207,0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
                }}>
                  <img
                    src={project.image}
                    alt={project.name}
                    style={{ width: '100%', display: 'block', objectFit: 'cover' }}
                  />
                </div>

                {/* Placeholder grid for more media */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  {[1, 2, 3, 4].map(i => (
                    <div
                      key={i}
                      style={{
                        height: 100,
                        borderRadius: 10,
                        background: 'rgba(180,151,207,0.06)',
                        border: '1px dashed rgba(180,151,207,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'rgba(180,151,207,0.35)',
                        fontFamily: "'Fira Code', monospace",
                        fontSize: '0.65rem',
                        letterSpacing: '0.08em',
                      }}
                    >
                      media {i}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Bottom spacer */}
              <div style={{ height: 40 }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
