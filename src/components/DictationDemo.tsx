import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * The dictation showcase.
 *
 * Telling someone "hold Right Ctrl and speak" is a manual. The thing worth
 * showing is the gap between what people actually say — hesitations, restarts,
 * "um" — and the sentence that lands in their document. So the raw speech types
 * itself out, then snaps to the finished text.
 *
 * The example is deliberately messy. A clean one would prove nothing.
 */

const RAW = 'um so basically we need to uh ship the migration by friday i think';
const CLEAN = 'We need to ship the migration by Friday.';

const TYPE_MS = 34;
const HOLD_MS = 700;
const CLEAN_MS = 2600;

export default function DictationDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20% 0px' });
  const [typed, setTyped] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'raw' | 'clean'>('idle');
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setTyped(RAW.length);
      setPhase('clean');
      return;
    }
    const timers: number[] = [];
    setPhase('raw');
    for (let i = 1; i <= RAW.length; i++) {
      timers.push(window.setTimeout(() => setTyped(i), i * TYPE_MS));
    }
    timers.push(
      window.setTimeout(() => setPhase('clean'), RAW.length * TYPE_MS + HOLD_MS),
    );
    // Loop back so a visitor who lands mid-way still sees the whole idea.
    const loop = window.setInterval(
      () => {
        setTyped(0);
        setPhase('raw');
        for (let i = 1; i <= RAW.length; i++) {
          timers.push(window.setTimeout(() => setTyped(i), i * TYPE_MS));
        }
        timers.push(
          window.setTimeout(() => setPhase('clean'), RAW.length * TYPE_MS + HOLD_MS),
        );
      },
      RAW.length * TYPE_MS + HOLD_MS + CLEAN_MS,
    );
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [inView, reduced]);

  return (
    <div ref={ref} className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm">
      <div className="mb-5 flex items-center gap-2.5">
        <kbd className="rounded-md border border-white/15 bg-white/[0.04] px-2 py-1 font-geist text-[11px] text-white/60">
          Right Ctrl
        </kbd>
        <span className="font-geist text-[11px] text-white/30">
          {phase === 'clean' ? 'released' : 'held down'}
        </span>
        {phase === 'raw' && (
          <span className="ml-auto flex items-end gap-[3px]" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                className="w-[3px] rounded-full bg-sky-300/70"
                animate={{ height: [4, 14, 7, 16, 5] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.09,
                  ease: 'easeInOut',
                }}
              />
            ))}
          </span>
        )}
      </div>

      <div className="min-h-[92px] rounded-xl border border-white/[0.06] bg-black/40 p-4">
        {phase !== 'clean' ? (
          <p className="font-geist text-[14px] leading-relaxed text-white/35">
            {RAW.slice(0, typed)}
            <span className="ml-[1px] inline-block h-[15px] w-[2px] translate-y-[2px] animate-pulse bg-sky-300/80" />
          </p>
        ) : (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="font-geist text-[14px] leading-relaxed text-white/85"
          >
            {CLEAN}
          </motion.p>
        )}
      </div>

      <p className="mt-4 font-geist text-[12px] leading-relaxed text-white/35">
        You talk the way you talk. The fillers, the false starts and the second
        thoughts come out; the sentence goes in. Anywhere you can type: an email, a
        chat, a document, your code editor.
      </p>
    </div>
  );
}
