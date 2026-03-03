import { motion } from 'motion/react';
import { ArrowRight, Moon, Star, Heart } from 'lucide-react';

interface UcapanPageProps {
  onNext: () => void;
}

export default function UcapanPage({ onNext }: UcapanPageProps) {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#022c22] to-[#064e3b] text-emerald-50 px-6 py-20 text-center">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/2 -right-1/2 w-[150%] h-[150%] bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"
        ></motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute top-10 right-10"
        >
          <Moon className="w-24 h-24 text-yellow-200 drop-shadow-[0_0_15px_rgba(253,224,71,0.5)]" />
        </motion.div>
        
        {/* Shooting Star */}
        <motion.div
          initial={{ top: "10%", left: "100%", opacity: 0 }}
          animate={{ top: "60%", left: "-10%", opacity: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: "easeOut" }}
          className="absolute w-32 h-1 bg-gradient-to-l from-transparent via-white to-transparent transform -rotate-45"
        ></motion.div>

        {/* Decorative Glows */}
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-emerald-500 rounded-full blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-yellow-500 rounded-full blur-[100px] opacity-10"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 max-w-lg"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-5xl font-script text-yellow-300 mb-10 drop-shadow-lg leading-relaxed"
        >
          Indah Langit Kerana Bintang,
        </motion.h2>

        <div className="space-y-8 text-2xl md:text-3xl font-script leading-relaxed text-emerald-100/90">
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="border-l-2 border-yellow-400/30 pl-4"
          >
            Indah laut kerana gelombang,<br/>
            Indah gunung kerana relung,<br/>
            Indah raya kerana maaf.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 1 }}
            className="bg-white/5 backdrop-blur-sm p-6 rounded-2xl border border-white/10 shadow-xl font-sans text-lg"
          >
            <p className="mb-4">
              Di kesempatan ini, Adam menyusun sepuluh jari memohon ampun dan maaf andai ada terkasar bahasa, tersilap bicara, atau terguris rasa sepanjang persahabatan kita.
            </p>
            <p className="text-yellow-200 italic font-script text-2xl">
              "Kosong-kosong ya?"
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="mt-12 w-full flex justify-center"
        >
          <button
            onClick={onNext}
            className="group relative inline-flex items-center justify-center px-6 py-4 text-base md:text-lg font-bold text-white transition-all duration-200 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full hover:from-emerald-500 hover:to-teal-500 shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 w-full max-w-xs md:w-auto"
          >
            <Heart className="w-5 h-5 mr-2 text-red-300 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">Jom Sembang & Claim Duit Raya</span>
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform shrink-0" />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
