import { motion } from 'motion/react';
import { CheckCircle, XCircle, Share2, Wallet, RefreshCw } from 'lucide-react';

interface ResultPageProps {
  onReset: () => void;
  success: boolean;
}

export default function ResultPage({ onReset, success }: ResultPageProps) {
  const handleClaim = () => {
    // In a real app, this would be a deep link
    window.open('https://www.touchngo.com.my/', '_blank');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 w-full max-w-md mx-auto">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
        className={`w-full bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl border ${success ? 'border-emerald-200' : 'border-red-200'} relative overflow-hidden`}
      >
        {/* Decorative background elements */}
        <div className={`absolute -top-10 -right-10 w-32 h-32 ${success ? 'bg-yellow-300' : 'bg-red-300'} rounded-full opacity-20 blur-2xl`}></div>
        <div className={`absolute -bottom-10 -left-10 w-32 h-32 ${success ? 'bg-emerald-300' : 'bg-orange-300'} rounded-full opacity-20 blur-2xl`}></div>

        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring" }}
          className={`w-24 h-24 ${success ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'} rounded-full flex items-center justify-center mx-auto mb-6 border-4`}
        >
          {success ? (
            <CheckCircle className="w-12 h-12 text-green-600" />
          ) : (
            <XCircle className="w-12 h-12 text-red-600" />
          )}
        </motion.div>

        <h2 className={`text-2xl font-bold ${success ? 'text-emerald-800' : 'text-red-800'} mb-2`}>
          {success ? "Confirm geng rapat ni." : "Aduh... kantoi bukan geng."}
        </h2>
        <p className="text-gray-600 mb-8">
          {success ? "Duit raya approved 💚" : "Duit raya ditangguhkan 😅"}
        </p>

        <div className={`${success ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'} rounded-xl p-4 mb-8 border`}>
          <p className={`text-sm ${success ? 'text-emerald-800' : 'text-red-800'} font-medium mb-1`}>
            Status: {success ? "LULUS ✅" : "GAGAL ❌"}
          </p>
          <p className={`text-xs ${success ? 'text-emerald-600' : 'text-red-600'} mb-3`}>
            {success ? "Pak Cik Raya AI approved your request." : "Pak Cik Raya AI rejected your request."}
          </p>
          {success && (
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-red-500 bg-red-50 px-3 py-1 rounded-full w-fit mx-auto animate-pulse">
              🔥 Only 10 packets left!
            </div>
          )}
        </div>

        {success ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleClaim}
            className="w-full bg-[#005EB8] hover:bg-[#004C94] text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 mb-4 transition-colors"
          >
            <Wallet className="w-6 h-6" />
            Claim via Touch 'n Go
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReset}
            className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg flex items-center justify-center gap-3 mb-4 transition-colors"
          >
            <RefreshCw className="w-6 h-6" />
            Cuba Lagi (Try Again)
          </motion.button>
        )}

        {success && (
          <button 
            className="text-gray-400 text-sm hover:text-gray-600 flex items-center justify-center gap-2 mx-auto mt-4"
            onClick={() => alert('Link copied to clipboard!')}
          >
            <Share2 className="w-4 h-4" />
            Share with friends
          </button>
        )}

        {success && (
          <button
            onClick={onReset}
            className="mt-8 text-emerald-600 hover:text-emerald-800 text-sm font-medium underline underline-offset-4"
          >
            Back to Home
          </button>
        )}
      </motion.div>
    </div>
  );
}
