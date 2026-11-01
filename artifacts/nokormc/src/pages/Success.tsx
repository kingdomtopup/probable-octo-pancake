import { Link, useSearch } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle2, ChevronRight, Download } from "lucide-react";
import { useEffect, useState } from "react";
import ReactConfetti from 'react-confetti';

export default function Success() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const transactionId = params.get("tx");
  
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="flex-1 w-full flex items-center justify-center py-20 px-4">
      <ReactConfetti
        width={windowDimension.width}
        height={windowDimension.height}
        recycle={false}
        numberOfPieces={500}
        colors={['#7c3aed', '#2563eb', '#f59e0b', '#10b981']}
      />

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="glass-panel max-w-md w-full p-8 md:p-12 rounded-3xl border border-primary/30 text-center relative overflow-hidden shadow-[0_0_50px_rgba(124,58,237,0.15)]"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-secondary" />
        
        <motion.div 
          initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring" }}
          className="w-24 h-24 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]"
        >
          <CheckCircle2 className="w-12 h-12" />
        </motion.div>

        <h1 className="text-3xl font-display font-bold text-white mb-2">Payment Successful!</h1>
        <p className="text-zinc-400 mb-8">
          Your top-up has been successfully processed. The items will be credited to your account shortly.
        </p>

        <div className="bg-black/30 rounded-xl p-4 mb-8 text-left border border-white/5 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Transaction ID</span>
            <span className="font-mono text-zinc-300">{transactionId || "TRX-UNKNOWN"}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-zinc-500">Status</span>
            <span className="text-green-400 font-medium bg-green-500/10 px-2 py-0.5 rounded">Completed</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/"
            className="w-full py-3.5 rounded-xl font-bold bg-primary hover:bg-primary/90 text-white transition-colors flex items-center justify-center gap-2"
          >
            Return to Home <ChevronRight className="w-4 h-4" />
          </Link>
          <button className="w-full py-3.5 rounded-xl font-medium bg-white/5 hover:bg-white/10 text-white transition-colors flex items-center justify-center gap-2">
            <Download className="w-4 h-4" /> Download Receipt
          </button>
        </div>
      </motion.div>
    </div>
  );
}
