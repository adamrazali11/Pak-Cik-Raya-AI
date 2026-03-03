import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import LandingPage from './components/LandingPage';
import UcapanPage from './components/UcapanPage';
import ChatInterface from './components/ChatInterface';
import ResultPage from './components/ResultPage';
import Footer from './components/Footer';

type ViewState = 'landing' | 'ucapan' | 'chat' | 'result';

export default function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleStart = () => {
    setView('ucapan');
    // Try to play music on first interaction if not already playing
    if (audioRef.current && !isPlaying) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const handleUcapanNext = () => {
    setView('chat');
  };

  const [resultSuccess, setResultSuccess] = useState(false);

  const handleChatComplete = (success: boolean) => {
    setResultSuccess(success);
    setView('result');
  };

  const handleReset = () => {
    setView('landing');
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const isFullscreenView = view === 'landing' || view === 'ucapan';

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-emerald-50">
      {/* Background Music */}
      <audio ref={audioRef} loop>
        {/* Replace 'raya.mp3' with your actual file name in public/assets folder */}
        <source src="/assets/raya.mp3" type="audio/mpeg" />
        {/* Fallback to online URL if local file fails (optional, good for testing) */}
        <source src="https://archive.org/download/suasana-hari-raya-instrumental/Suasana%20Hari%20Raya%20%28Instrumental%29.mp3" type="audio/mpeg" />
      </audio>

      {/* Music Toggle */}
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 bg-white/80 backdrop-blur-md p-3 rounded-full shadow-lg text-emerald-800 hover:bg-white transition-all"
      >
        {isPlaying ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
      </button>

      {/* Background Pattern - Only show on non-fullscreen pages */}
      {!isFullscreenView && <div className="ketupat-bg"></div>}

      {/* Main Content */}
      <main 
        className={`flex-1 flex flex-col items-center justify-center w-full relative z-10 ${
          isFullscreenView ? '' : 'p-4 max-w-md mx-auto'
        }`}
      >
        <AnimatePresence mode="wait">
          {view === 'landing' && (
            <motion.div
              key="landing"
              className="w-full h-full"
              exit={{ opacity: 0 }}
            >
              <LandingPage onStart={handleStart} />
            </motion.div>
          )}

          {view === 'ucapan' && (
            <motion.div
              key="ucapan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full h-full"
            >
              <UcapanPage onNext={handleUcapanNext} />
            </motion.div>
          )}

          {view === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full h-full flex items-center justify-center"
            >
              <ChatInterface onComplete={handleChatComplete} />
            </motion.div>
          )}

          {view === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              <ResultPage onReset={handleReset} success={resultSuccess} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {!isFullscreenView && <Footer />}
    </div>
  );
}
