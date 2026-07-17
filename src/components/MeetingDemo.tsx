import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * The Meeting Notes showcase.
 *
 * The product is not the recording, it is the document. So this shows the
 * document being written: a conversation arrives on the left, and the finished
 * page assembles on the right. Nothing here is invented marketing output — this
 * is the real shape Voxhelm produces, down to the "unassigned" action item,
 * which is the detail that proves it does not make up owners.
 *
 * Runs once on scroll-in, then holds the finished document on screen. It does
 * not loop: the point is the artifact, not the animation.
 */

type Line = { t: string; who: 'Me' | 'Them'; text: string };

const TRANSCRIPT: Line[] = [
  { t: '00:02', who: 'Them', text: 'Right, let us start the quarterly review.' },
  { t: '00:09', who: 'Them', text: 'The main decision today: we postpone the launch to the 15th of September.' },
  { t: '00:15', who: 'Me', text: 'Because the migration is not ready?' },
  { t: '00:18', who: 'Them', text: 'Exactly. Priya will own the migration plan and report back Thursday.' },
  { t: '00:26', who: 'Them', text: 'And someone has to confirm the budget with finance before Friday.' },
  { t: '00:31', who: 'Me', text: 'We have not agreed who yet.' },
];

/** Timing: transcript lines land, then the document writes itself. */
const LINE_MS = 620;
const DOC_DELAY = TRANSCRIPT.length * LINE_MS + 250;
const DOC_STEP = 380;

export default function MeetingDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-15% 0px' });
  const [lines, setLines] = useState(0);
  const [doc, setDoc] = useState(0);
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!inView) return;
    // Respect the OS setting: show the finished result rather than deny it.
    if (reduced) {
      setLines(TRANSCRIPT.length);
      setDoc(5);
      return;
    }
    const timers: number[] = [];
    TRANSCRIPT.forEach((_, i) => {
      timers.push(window.setTimeout(() => setLines(i + 1), i * LINE_MS));
    });
    for (let i = 1; i <= 5; i++) {
      timers.push(window.setTimeout(() => setDoc(i), DOC_DELAY + (i - 1) * DOC_STEP));
    }
    return () => timers.forEach(clearTimeout);
  }, [inView, reduced]);

  const writing = lines >= TRANSCRIPT.length && doc < 5;

  return (
    <div ref={ref} className="grid gap-4 lg:grid-cols-[1fr_1.15fr] lg:gap-5">
      {/* The call */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="font-geist text-[11px] uppercase tracking-widest2 text-white/40">
            Your meeting
          </span>
        </div>

        <div className="space-y-3">
          {TRANSCRIPT.map((l, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={i < lines ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex gap-3"
            >
              <span className="mt-[3px] shrink-0 font-geist text-[10px] tabular-nums text-white/25">
                {l.t}
              </span>
              <p className="font-geist text-[13px] leading-relaxed">
                <span
                  className={
                    l.who === 'Me'
                      ? 'mr-1.5 text-sky-300/90'
                      : 'mr-1.5 text-white/35'
                  }
                >
                  {l.who}
                </span>
                <span className="text-white/70">{l.text}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* The document */}
      <div className="relative rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-sm">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-geist text-[11px] uppercase tracking-widest2 text-white/40">
            Your document
          </span>
          <span className="font-geist text-[10px] text-white/25">notes.md</span>
        </div>

        {writing && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-x-5 top-1/2 text-center font-geist text-[12px] text-white/30"
          >
            writing…
          </motion.p>
        )}

        <div className={writing ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
          <Block show={doc >= 1}>
            <h4 className="font-garamond text-lg text-white/90">
              Quarterly review: launch postponed
            </h4>
            <p className="mt-1 font-geist text-[11px] text-white/30">17 July, 32 min</p>
          </Block>

          <Block show={doc >= 2} className="mt-5">
            <Label>TL;DR</Label>
            <p className="mt-1.5 font-geist text-[12.5px] leading-relaxed text-white/60">
              The launch moves to 15 September because the migration is not ready. Priya
              owns the migration plan; the budget still needs confirming with finance by
              Friday.
            </p>
          </Block>

          <Block show={doc >= 3} className="mt-5">
            <Label>Decisions</Label>
            <p className="mt-1.5 font-geist text-[12.5px] leading-relaxed text-white/60">
              1. Postpone the launch to 15 September, due to migration delays.
            </p>
          </Block>

          <Block show={doc >= 4} className="mt-5">
            <Label>Action items</Label>
            <ul className="mt-1.5 space-y-1.5 font-geist text-[12.5px] leading-relaxed text-white/60">
              <li className="flex gap-2">
                <span className="text-white/25">☐</span>
                <span>
                  Own the migration plan{' '}
                  <span className="text-white/85">— Priya</span>
                  <span className="text-white/30">, due Thursday</span>
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-white/25">☐</span>
                <span>
                  Confirm the budget with finance{' '}
                  {/* The load-bearing detail: nobody was named in the call, so
                      nobody is named here. This is what "it does not make things
                      up" looks like, and it is worth showing rather than saying. */}
                  <span className="italic text-amber-300/70">— unassigned</span>
                  <span className="text-white/30">, due Friday</span>
                </span>
              </li>
            </ul>
          </Block>

          <Block show={doc >= 5} className="mt-5 border-t border-white/[0.06] pt-4">
            <p className="font-geist text-[11px] leading-relaxed text-white/30">
              Nobody said who owns the budget, so Voxhelm did not invent someone.
              The full transcript sits underneath, timestamped.
            </p>
          </Block>
        </div>
      </div>
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="font-geist text-[10px] uppercase tracking-widest2 text-white/35">
      {children}
    </span>
  );
}

function Block({
  show,
  className,
  children,
}: {
  show: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={show ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
