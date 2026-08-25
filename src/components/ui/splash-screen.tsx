import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

const OPEN_MS = 2800;
const HOLD_MS = 800;
const CLOSE_MS = 900;

type SplashPhase = "opening" | "hold" | "closing" | "done";

type SplashScreenProps = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState<SplashPhase>("opening");
  const completedRef = useRef(false);
  const isClosing = phase === "closing";

  useEffect(() => {
    document.body.classList.add("splash-active");

    const openHold = prefersReducedMotion ? 350 : OPEN_MS;
    const hold = prefersReducedMotion ? 150 : HOLD_MS;
    const closeDuration = prefersReducedMotion ? 280 : CLOSE_MS;

    const holdTimer = window.setTimeout(() => setPhase("hold"), openHold);
    const closeTimer = window.setTimeout(() => setPhase("closing"), openHold + hold);
    const doneTimer = window.setTimeout(() => {
      if (completedRef.current) return;
      completedRef.current = true;
      setPhase("done");
      setVisible(false);
      document.body.classList.remove("splash-active");
      onComplete();
    }, openHold + hold + closeDuration);

    return () => {
      window.clearTimeout(holdTimer);
      window.clearTimeout(closeTimer);
      window.clearTimeout(doneTimer);
      document.body.classList.remove("splash-active");
    };
  }, [onComplete, prefersReducedMotion]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#fafafa] overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          animate={
            prefersReducedMotion 
              ? { opacity: isClosing ? 0 : 1 } 
              : { opacity: isClosing ? 0 : 1, clipPath: isClosing ? "circle(0% at 50% 50%)" : "circle(150% at 50% 50%)" }
          }
          transition={{ duration: isClosing ? 0.8 : 0, ease: "easeInOut" }}
        >
          {/* Architectural Blueprint Grid (Light Theme) */}
          <div className="absolute inset-0 z-0 opacity-60">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0000000a_1px,transparent_1px),linear-gradient(to_bottom,#0000000a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:1rem_1rem]" />
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#fafafa_100%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.5 }}
            />
          </div>

          {/* Animated Construction/CAD Lines */}
          <motion.div
            className="absolute top-[25%] left-0 w-full h-[1px] bg-blue-600/20 z-0"
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: "circOut", delay: 0.1 }}
          />
          <motion.div
            className="absolute bottom-[25%] right-0 w-full h-[1px] bg-blue-600/20 z-0"
            initial={{ scaleX: 0, originX: 1 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.8, ease: "circOut", delay: 0.3 }}
          />
          <motion.div
            className="absolute left-[30%] top-0 w-[1px] h-full bg-blue-600/20 z-0"
            initial={{ scaleY: 0, originY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.8, ease: "circOut", delay: 0.5 }}
          />
          <motion.div
            className="absolute right-[30%] bottom-0 w-[1px] h-full bg-blue-600/20 z-0"
            initial={{ scaleY: 0, originY: 1 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.8, ease: "circOut", delay: 0.7 }}
          />

          {/* Ambient Glow */}
          <motion.div
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-blue-500/10 rounded-full blur-[100px]"
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 2.5, ease: "easeOut" }}
          />

          {/* Main Content Center */}
          <div className="relative z-10 flex flex-col items-center">
            
            {/* Reveal Box */}
            <motion.div
              className="relative rounded-2xl bg-white shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1),0_0_40px_-10px_rgba(59,130,246,0.15)] border border-slate-100 overflow-hidden px-8 py-6 md:px-10 md:py-8"
              initial={{ 
                opacity: 0, 
                y: 50,
                clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)"
              }}
              animate={{ 
                opacity: 1, 
                y: 0,
                clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)"
              }}
              transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Shimmer Effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100/50 to-transparent w-[200%] z-10 -skew-x-12"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
              />
              
              <img
                src="/hassan_allam_holding_logo.jpg"
                alt="Hassan Allam Logo"
                className="w-48 md:w-64 lg:w-72 h-auto object-contain mix-blend-multiply relative z-0"
              />
            </motion.div>

            {/* Premium Loader & Typography */}
            <motion.div
              className="mt-12 flex flex-col items-center w-full"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
            >
              {/* Elegant Sans-serif Text */}
              <motion.div
                 className="mb-5 text-slate-400 text-xs sm:text-sm tracking-widest font-sans font-medium"
                 animate={{ opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              >
                Loading Workspace
              </motion.div>

              {/* Sleek Skeleton Loading Line */}
              <div className="relative h-[1px] w-48 bg-slate-200/50 overflow-hidden rounded-full">
                <motion.div
                  className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </div>
            </motion.div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
