import PixelBlast from './components/PixelBlast';
import GradientText from './components/GradientText';
import CircularText from './components/CircularText';
import DecryptedText from './components/DecryptedText';
import RippleCircle from './components/RippleCircle';
import ContactForm from './components/ContactForm';
import VerticalGallery from './components/VerticalGallery';
import ProjectOverlay from './components/ProjectOverlay';
import { motion } from 'motion/react';
import { useState, useEffect } from 'react';

import project1 from './assets/Pulse.png';
import project2 from './assets/FraudFishing.png';
import project3 from './assets/medsync.png';
import project4 from './assets/FirewallDefenders.png';
import project5 from './assets/ddplata_portfolio.png';

function App() {
  const [showLastname, setShowLastname] = useState(false);
  const [showRest, setShowRest] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<{ name: string; image: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setShowLastname(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="w-screen h-screen bg-[#010626] relative overflow-hidden">
      <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
        <PixelBlast
          variant="circle"
          pixelSize={2}
          color="#B497CF"
          patternScale={2.25}
          patternDensity={1}
          pixelSizeJitter={0}
          enableRipples
          rippleSpeed={0.2}
          rippleThickness={0.02}
          rippleIntensityScale={1}
          liquid={false}
          liquidStrength={0.12}
          liquidRadius={1.2}
          liquidWobbleSpeed={5}
          speed={2}
          edgeFade={0.2}
          transparent
        />
      </div>

      {/* ── TOP right: Name ── */}
      <div className="absolute z-10" style={{ top: '10%', right: '5%', textAlign: 'right' }}>
        <h1
          className="font-Azonix leading-none"
          style={{
            fontSize: 'clamp(3rem, 6vw, 5rem)',
            lineHeight: 1.05,
            letterSpacing: '0.06em',
            fontWeight: 900,
            color: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
          }}
        >
          <DecryptedText
            text="JAVIER"
            animateOn="view"
            speed={60}
            maxIterations={15}
            sequential
            revealDirection="start"
            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*"
            className="text-white"
            encryptedClassName="text-[#B497CF]"
          />
          {showLastname && (
            <DecryptedText
              text="CANELLA"
              animateOn="view"
              speed={55}
              maxIterations={15}
              sequential
              revealDirection="end"
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*"
              className="text-white"
              encryptedClassName="text-[#B497CF]"
              onAnimationComplete={() => setShowRest(true)}
            />
          )}
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showRest ? 1 : 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >

        {/* ── center RIGHT: Description ── */}
        <div
          className="absolute z-10 text-right font-fira"
          style={{ bottom: '40%', right: '5%', maxWidth: 560, cursor: 'default' }}
        >
          <div style={{ fontSize: 'clamp(1.1rem, 2.2vw, 1.75rem)', lineHeight: 1.65, fontWeight: 300, color: '#f8f8ff', cursor: 'default' }}>
            I'm a{' '}
            <GradientText
              colors={["#3300ffff", "#ffe3feff", "#8800ffff"]}
              animationSpeed={5}
              showBorder={false}
              className="inline cursor-default"

            >
              web designer, mobile
            </GradientText>
            <GradientText
              colors={["#3300ffff", "#ffe3feff", "#8800ffff"]}
              animationSpeed={5}
              showBorder={false}
              className="inline cursor-default"
            >
              and full-stack developer
            </GradientText>
            {' '}who
            <br />
            enjoys creating simple,
            <br />
            modern, and engaging digital
            <br />
            experiences.
          </div>
        </div>

        {/* ── BOTTOM right: Circular Text ── */}
        <div
          className="absolute z-10 cursor-pointer hover:scale-105 transition-transform duration-300"
          style={{ bottom: '10%', right: '5%', width: 200, height: 200 }}
          onClick={() => setIsContactFormOpen(true)}
        >
          {/* RippleCircle centrado absolutamente dentro del contenedor */}
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 2,
            }}
          >
            <RippleCircle size={120} colorFrom="#ffffff" colorTo="#B497CF" />
          </div>

          <CircularText
            text="CONTACT•ME•CONTACT•ME•"
            onHover="slowDown"
            spinDuration={10}
            className="absolute inset-0"
          />
        </div>

        {/* ── LEFT: Vertical Gallery ── */}
        <div
          className="absolute z-10"
          style={{ top: 0, left: 0, width: '45%', height: '100vh' }}
        >
          <VerticalGallery
            bend={2}
            textColor="#B497CF"
            borderRadius={0.08}
            scrollSpeed={2}
            scrollEase={0.04}
            onCenterClick={(item) => setSelectedProject({ name: item.text, image: item.image })}
            items={[
              { image: project1, text: 'Pulse' },
              { image: project2, text: 'Fraud Fishing' },
              { image: project3, text: 'MedSync' },
              { image: project4, text: 'Firewall Defenders' },
              { image: project5, text: "ddplata's portfolio" },
            ]}
          />
        </div>
      </motion.div>

      <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
      <ProjectOverlay project={selectedProject} onClose={() => setSelectedProject(null)} />

    </main>
  );
}

export default App;
