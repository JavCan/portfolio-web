import { useRef, useState, useEffect, useCallback } from 'react';

interface CarouselItem {
  image: string;
  text: string;
}

interface VerticalGalleryProps {
  items?: CarouselItem[];
  onCenterClick?: (item: CarouselItem) => void;
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollSpeed?: number;
  scrollEase?: number;
}

const defaultItems: CarouselItem[] = [
  { image: 'https://picsum.photos/seed/a1/600/400', text: 'Project One' },
  { image: 'https://picsum.photos/seed/b2/600/400', text: 'Project Two' },
  { image: 'https://picsum.photos/seed/c3/600/400', text: 'Project Three' },
  { image: 'https://picsum.photos/seed/d4/600/400', text: 'Project Four' },
  { image: 'https://picsum.photos/seed/e5/600/400', text: 'Project Five' },
  { image: 'https://picsum.photos/seed/f6/600/400', text: 'Project Six' },
];

export default function VerticalGallery({ items, onCenterClick }: VerticalGalleryProps) {
  const gallery = items && items.length > 0 ? items : defaultItems;
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef({ current: 0, target: 0, velocity: 0 });
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const dragScrollStart = useRef(0);
  const rafRef = useRef(0);
  const [scrollY, setScrollY] = useState(0);

  // Ref updated every render with the current center item — used for click detection
  const centerItemRef = useRef<CarouselItem | null>(null);
  // Pointer position at mousedown — to distinguish click from drag
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const CARD_HEIGHT = 220;
  const CARD_GAP = 28;
  const ITEM_SIZE = CARD_HEIGHT + CARD_GAP;

  // Helper to wrap a value into [0, max) range
  const wrapValue = (v: number, max: number) => {
    return ((v % max) + max) % max;
  };

  // Animation loop with smooth lerp
  useEffect(() => {
    const ease = 0.08;
    const loop = () => {
      const s = scrollRef.current;
      const diff = s.target - s.current;
      s.current += diff * ease;

      // Snap current close to target to avoid floating point drift
      if (Math.abs(diff) < 0.05) {
        s.current = s.target;
      }

      setScrollY(s.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Wheel handler
  const onWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    scrollRef.current.target += e.deltaY * 0.6;
  }, []);

  // Mouse/touch drag handlers
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    isDragging.current = true;
    dragStart.current = e.clientY;
    dragScrollStart.current = scrollRef.current.target;
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!isDragging.current) return;
    const delta = dragStart.current - e.clientY;
    scrollRef.current.target = dragScrollStart.current + delta * 1.5;
  }, []);

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    isDragging.current = false;
    // Treat as click only if the pointer barely moved (< 6px) — i.e. not a drag
    const dx = Math.abs(e.clientX - pointerDownPos.current.x);
    const dy = Math.abs(e.clientY - pointerDownPos.current.y);
    if (Math.sqrt(dx * dx + dy * dy) < 6) {
      // Fire callback with whatever item is currently in the center
      const center = centerItemRef.current;
      if (center) onCenterClick?.(center);
    }
  }, [onCenterClick]);

  // Attach wheel listener with passive: false
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onWheel]);

  // Compute card positions
  const containerHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const centerY = containerHeight / 2;

  // 1. Calculate how many items we need to cover the viewport plus padding
  const minSlots = Math.ceil(containerHeight / ITEM_SIZE) + 2;
  // 2. Ensure we render a multiple of the gallery length for a seamless sequence
  const multiplier = Math.ceil(minSlots / gallery.length);
  const renderCount = gallery.length * multiplier;
  // 3. The total height of the virtual strip
  const TOTAL_STRIP = renderCount * ITEM_SIZE;

  const cards: {
    item: CarouselItem;
    y: number;
    scale: number;
    opacity: number;
    xOffset: number;
    key: number;
    absDist: number;
    isCenter: boolean;
  }[] = [];

  for (let slot = 0; slot < renderCount; slot++) {
    const itemIndex = slot % gallery.length;
    const item = gallery[itemIndex];

    // Current scroll position wrapped to the strip height
    const wrappedScroll = wrapValue(scrollY, TOTAL_STRIP);
    
    // Theoretical position of this slot
    const rawY = slot * ITEM_SIZE - wrappedScroll;
    
    // Wrap rawY into a window centered on the viewport
    const halfStrip = TOTAL_STRIP / 2;
    const y = ((rawY + halfStrip) % TOTAL_STRIP + TOTAL_STRIP) % TOTAL_STRIP - halfStrip;

    // Map to screen coordinates (y=0 is viewport center)
    const screenY = y + centerY - CARD_HEIGHT / 2;

    // Distance from center of viewport (normalized)
    const distFromCenter = (screenY + CARD_HEIGHT / 2 - centerY) / centerY;
    const absDist = Math.abs(distFromCenter);

    // Scale: center = 1, edges = 0.72
    const scale = Math.max(0.7, 1 - absDist * 0.25);
    // Opacity: center = 1, edges = 0.25
    const opacity = Math.max(0.25, 1 - absDist * 0.6);
    // Horizontal offset: push cards away from center for a curved effect
    const xOffset = absDist * absDist * 60;

    const isCenter = absDist < 0.25;
    cards.push({ item, y: screenY, scale, opacity, xOffset, key: slot, absDist, isCenter });
  }

  // Keep centerItemRef up-to-date so onPointerUp can read it without closure staleness
  const centerCard = cards.find(c => c.isCenter);
  centerItemRef.current = centerCard ? centerCard.item : null;

  // Sort by absDist so center card renders on top
  const sorted = [...cards].sort((a, b) => b.absDist - a.absDist);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        cursor: isDragging.current ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
    >
      {sorted.map(({ item, y, scale, opacity, xOffset, key, isCenter }) => (
        <div
          key={key}
          style={{
            position: 'absolute',
            left: `calc(50% - ${160 + xOffset}px)`,
            top: y,
            width: 320,
            height: CARD_HEIGHT,
            transform: `scale(${scale})`,
            opacity,
            transition: isDragging.current ? 'none' : 'transform 0.05s ease-out',
            borderRadius: 16,
            overflow: 'hidden',
            willChange: 'transform, opacity',
            pointerEvents: 'auto',
            cursor: isCenter ? 'pointer' : 'inherit',
            outline: isCenter ? '2px solid rgba(180,151,207,0.55)' : 'none',
            outlineOffset: 2,
            boxShadow: isCenter ? '0 0 28px rgba(180,151,207,0.22)' : 'none',
          }}
        >
          {/* Card background image */}
          <img
            src={item.image}
            alt={item.text}
            draggable={false}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              borderRadius: 16,
            }}
          />
          {/* Card label overlay */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px 16px 14px',
              background: 'linear-gradient(transparent, rgba(1,6,38,0.85))',
              borderRadius: '0 0 16px 16px',
            }}
          >
            <span
              style={{
                fontFamily: "'Fira Code', monospace",
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#f8f8ff',
                letterSpacing: '0.04em',
              }}
            >
              {item.text}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}