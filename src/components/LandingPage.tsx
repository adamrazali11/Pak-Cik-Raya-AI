import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600">
      
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')]"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/50 to-transparent pointer-events-none"></div>

      {/* Curtain Animation Overlay */}
      <motion.div
        initial={{ height: "100%" }}
        animate={{ height: "0%" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        className="absolute top-0 left-0 w-full bg-emerald-900 z-50 flex items-center justify-center"
      >
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="text-emerald-100 text-3xl font-bold tracking-[0.5em] font-serif"
        >
          BUKA UCAPAN...
        </motion.div>
      </motion.div>

      {/* Hanging Lantern Ornaments (Images) */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-40 overflow-hidden">
        {/* Left Lantern */}
        <motion.div 
          initial={{ y: -300 }}
          animate={{ y: 10, rotate: [0, 2, 0, -2, 0] }}
          transition={{ 
            y: { duration: 1.2, delay: 1.5, type: "spring" },
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" } 
          }}
          className="absolute -top-4 left-0 w-32 h-64 md:w-48 md:h-96"
        >
           <img 
             src="https://static.vecteezy.com/system/resources/thumbnails/054/300/170/small/lantern-decoration-3d-ramadan-illustration-png.png" 
             alt="Lantern Decoration" 
             className="w-full h-full object-contain object-top drop-shadow-lg origin-top"
             referrerPolicy="no-referrer"
           />
        </motion.div>

        {/* Right Lantern */}
        <motion.div 
          initial={{ y: -300 }}
          animate={{ y: 5, rotate: [0, -2, 0, 2, 0] }}
          transition={{ 
            y: { duration: 1.5, delay: 1.7, type: "spring" },
            rotate: { duration: 7, repeat: Infinity, ease: "easeInOut" } 
          }}
          className="absolute -top-4 right-0 w-28 h-56 md:w-40 md:h-80"
        >
           <img 
             src="https://static.vecteezy.com/system/resources/thumbnails/054/300/170/small/lantern-decoration-3d-ramadan-illustration-png.png" 
             alt="Lantern Decoration" 
             className="w-full h-full object-contain object-top drop-shadow-lg transform scale-x-[-1] origin-top" 
             referrerPolicy="no-referrer"
           />
        </motion.div>
      </div>

      {/* Layer 1 (Back) */}
      <div className="absolute inset-0 bg-[#14532d] z-0 opacity-50"></div>

      {/* Layer 2 */}
      <div className="absolute inset-x-4 top-4 bottom-0 bg-[#166534] rounded-t-[10rem] shadow-lg z-10 transform scale-95 origin-bottom opacity-80"></div>

      {/* Layer 3 */}
      <div className="absolute inset-x-8 top-12 bottom-0 bg-[#15803d] rounded-t-[8rem] shadow-lg z-20 transform scale-95 origin-bottom opacity-90"></div>

      {/* Layer 4 (Front Arch) */}
      <div className="absolute inset-x-0 bottom-0 h-[85%] bg-gradient-to-b from-[#22c55e] to-[#15803d] rounded-t-[12rem] shadow-2xl z-30 flex flex-col items-center pt-24 px-6 text-center border-t-4 border-yellow-400/20">
        
        {/* Content Container */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="relative z-40 flex flex-col items-center w-full max-w-md"
        >
          {/* Arabic Calligraphy Placeholder */}
          <motion.div 
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-2 text-emerald-100 font-serif text-4xl opacity-90 drop-shadow-lg"
          >
            عيد مبارك
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-script text-white mb-2 drop-shadow-md transform -rotate-2 leading-tight">
            Selamat Hari Raya
          </h1>
          <h2 className="text-3xl md:text-5xl font-script text-emerald-100 mb-8 drop-shadow-sm">
            Aidilfitri
          </h2>

          <p className="text-emerald-50 text-xl md:text-2xl mb-10 font-script leading-relaxed opacity-90 max-w-lg drop-shadow-md">
            "Ketupat dan rendang lazat menghiasi meja raya,<br/>
            Senyum gembira terpancar di wajah semua."
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(250, 204, 21, 0.6)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="bg-gradient-to-r from-yellow-400 to-yellow-300 text-emerald-900 font-bold py-4 px-10 rounded-full shadow-xl flex items-center justify-center gap-3 transition-all z-50 border-2 border-yellow-200"
          >
            <span className="tracking-wide font-sans">CLAIM DUIT RAYA</span>
          </motion.button>
        </motion.div>

        {/* Mosque Silhouette (Image) */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute bottom-0 left-0 w-full z-30 pointer-events-none flex items-end justify-center"
        >
           <img 
             src="https://www.pngall.com/wp-content/uploads/4/Mosque-PNG-Download-Image.png" 
             alt="Mosque Silhouette" 
             className="w-full max-w-6xl h-auto object-contain opacity-90 drop-shadow-2xl filter brightness-0 invert"
             referrerPolicy="no-referrer"
           />
        </motion.div>

        {/* Clouds */}
        <motion.div 
          animate={{ x: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-24 h-10 bg-white/20 rounded-full blur-md"
        ></motion.div>
        <motion.div 
          animate={{ x: [0, -30, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="absolute top-32 right-10 w-32 h-12 bg-white/20 rounded-full blur-md"
        ></motion.div>

      </div>
      
      {/* Stars */}
      <div className="absolute top-0 left-0 w-full h-1/2 pointer-events-none z-20">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-yellow-200"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              fontSize: `${Math.random() * 20 + 10}px`
            }}
            animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.2, 0.8] }}
            transition={{ duration: Math.random() * 2 + 1, repeat: Infinity }}
          >
            ✦
          </motion.div>
        ))}
      </div>

    </div>
  );
}
