import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const OPEN_MS = 1600;
const HOLD_MS = 700;
const CLOSE_MS = 900;

type SplashPhase = "opening" | "hold" | "closing" | "done";

type SplashScreenProps = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<SplashPhase>("opening");
  const [revealed, setRevealed] = useState(false);
  const completedRef = useRef(false);
  const isClosing = phase === "closing";
  const showLogo = revealed && !isClosing;

  useEffect(() => {
    document.body.classList.add("splash-active");

    const openHold = prefersReducedMotion ? 350 : OPEN_MS;
    const hold = prefersReducedMotion ? 150 : HOLD_MS;
    const closeDuration = prefersReducedMotion ? 280 : CLOSE_MS;
    const revealDelay = prefersReducedMotion ? 60 : 280;

    const revealTimer = window.setTimeout(() => setRevealed(true), revealDelay);
    const holdTimer = window.setTimeout(() => setPhase("hold"), openHold);
    const closeTimer = window.setTimeout(() => setPhase("closing"), openHold + hold);
    const doneTimer = window.setTimeout(() => {
      if (completedRef.current) {
        return;
      }
      completedRef.current = true;
      setPhase("done");
      setVisible(false);
      document.body.classList.remove("splash-active");
      onComplete();
    }, openHold + hold + closeDuration);

    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(holdTimer);
      window.clearTimeout(closeTimer);
      window.clearTimeout(doneTimer);
      document.body.classList.remove("splash-active");
    };
  }, [onComplete, prefersReducedMotion]);

  if (!visible) {
    return null;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
          initial={false}
          animate={
            prefersReducedMotion
              ? { opacity: isClosing ? 0 : 1 }
              : { clipPath: isClosing ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)" }
          }
          transition={{
            duration: prefersReducedMotion ? 0.35 : isClosing ? 0.85 : 0,
            ease: [0.77, 0, 0.175, 1],
          }}
          aria-hidden={isClosing}
        >
          <div className="flex items-center justify-center w-full h-full" aria-label="Hassan Allam">
            <div className="relative w-32 md:w-48 flex justify-center">
              <motion.img
                src="/hassan_allam_holding_logo.jpg"
                alt="Hassan Allam Logo"
                className="w-full h-auto object-contain rounded-xl shadow-sm mix-blend-multiply"
                initial={{ opacity: 0, y: 14, filter: "blur(8px)", scale: 0.98 }}
                animate={{
                  opacity: showLogo ? 1 : 0,
                  y: showLogo ? 0 : 10,
                  filter: isClosing ? "blur(6px)" : showLogo ? "blur(0px)" : "blur(8px)",
                  scale: isClosing ? 1.03 : showLogo ? 1 : 0.98,
                }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
