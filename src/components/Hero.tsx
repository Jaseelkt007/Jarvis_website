import { useState } from 'react';
import { motion, AnimatePresence, useInView, type Variants } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useRef } from 'react';

/**
 * Cinematic hero for Voxhelm — full-screen video backdrop, staggered Garamond
 * headline, glass nav + mobile menu, liquid-glass CTA. Rendered to HTML by Astro
 * (SSR) and hydrated as a client island, so the copy is in the page source for
 * SEO while the motion plays for visitors.
 */

// Swappable background loop. Replace with on-brand footage anytime — a heavy
// dark overlay sits on top so any clip reads as a cinematic backdrop.
const HERO_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260619_191346_9d19d66e-86a4-47f7-8dc6-712c1788c3b2.mp4';

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Support', href: '#support' },
];

function StaggeredFade({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
  };
  const child: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  };
  return (
    <motion.span
      ref={ref}
      className={className}
      variants={container}
      initial="hidden"
      animate={inView ? 'show' : 'hidden'}
      aria-hidden="true"
    >
      {text.split('').map((ch, i) => (
        <motion.span key={i} variants={child} style={{ display: 'inline-block' }}>
          {ch === ' ' ? ' ' : ch}
        </motion.span>
      ))}
    </motion.span>
  );
}

export default function Hero() {
  const [open, setOpen] = useState(false);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-ink">
      {/* Background video + cinematic overlay */}
      <video
        className="absolute inset-0 h-full w-full object-cover object-center"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
      <div
        className="absolute inset-0"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(180deg, rgba(1,1,1,0.55) 0%, rgba(1,1,1,0.15) 35%, rgba(1,1,1,0.55) 75%, rgba(1,1,1,0.95) 100%)',
        }}
      />

      {/* Navigation */}
      <nav className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
        <a
          href="#top"
          className="font-light uppercase text-white"
          style={{ letterSpacing: '0.25em' }}
        >
          Voxhelm
        </a>

        <div className="hidden items-center gap-9 md:flex">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[13px] font-light uppercase text-white/80 transition-colors duration-300 hover:text-white"
              style={{ letterSpacing: '0.2em' }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="/downloads/Voxhelm-Setup.exe"
            className="liquid-glass rounded-full px-5 py-2.5 text-[12px] font-light uppercase text-white/90"
            style={{ letterSpacing: '0.18em' }}
          >
            Download
          </a>
        </div>

        <button
          className="text-white md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="mobile-menu-glass fixed left-4 right-4 top-16 z-50 flex flex-col items-center gap-5 rounded-2xl py-8 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {NAV_LINKS.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-light uppercase text-white/90 transition-colors hover:text-white"
                style={{ letterSpacing: '0.25em' }}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.06 }}
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="/downloads/Voxhelm-Setup.exe"
              onClick={() => setOpen(false)}
              className="liquid-glass mt-1 rounded-full px-7 py-3 text-[12px] font-light uppercase text-white/90"
              style={{ letterSpacing: '0.2em' }}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + NAV_LINKS.length * 0.06 }}
            >
              Download for Windows
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero content */}
      <div className="relative z-10 mx-auto flex h-[calc(100vh-88px)] max-w-5xl flex-col items-center justify-center px-5 pb-16 text-center sm:px-8">
        <h1 className="font-garamond mb-6 font-normal leading-[1.08] tracking-tight text-white sm:mb-8">
          <span className="sr-only">
            Voxhelm — an AI that lives in your Windows PC. Never work alone again.{' '}
          </span>
          <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
            <StaggeredFade text="Never work" />
          </span>
          <span className="block text-5xl sm:text-7xl md:text-8xl lg:text-9xl">
            <StaggeredFade text="alone again." />
          </span>
        </h1>

        <motion.p
          className="mb-8 max-w-xs text-sm font-light leading-relaxed text-white/70 sm:mb-10 sm:max-w-xl sm:text-base md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
        >
          Voxhelm lives on your PC. It sees what you're doing, talks it through with you,
          does the parts you'd rather skip — and shows you how, when you want to learn.
        </motion.p>

        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row sm:gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
        >
          <a
            href="/downloads/Voxhelm-Setup.exe"
            className="liquid-glass rounded-full px-8 py-4 text-[13px] font-normal uppercase text-white/90 sm:px-10"
            style={{ letterSpacing: '0.18em' }}
          >
            Download for Windows
          </a>
          <span
            className="rounded-full border border-white/15 px-6 py-4 text-[13px] font-light uppercase text-white/55"
            style={{ letterSpacing: '0.18em' }}
          >
            macOS &mdash; coming soon
          </span>
        </motion.div>

        <p className="mt-6 text-[11px] font-light uppercase tracking-[0.18em] text-white/40">
          Windows 10 / 11 · 64-bit
        </p>
      </div>
    </section>
  );
}
