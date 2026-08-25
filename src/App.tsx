import { useState } from 'react';
import { Dashboard } from './pages/Dashboard';
import { SplashScreen } from './components/ui/splash-screen';
import { AnimatePresence, motion } from 'motion/react';

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      <AnimatePresence mode="wait">
        {showSplash && <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />}
      </AnimatePresence>
      
      {!showSplash && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="min-h-screen"
        >
          <Dashboard />
        </motion.div>
      )}
    </>
  );
};

export default App;
