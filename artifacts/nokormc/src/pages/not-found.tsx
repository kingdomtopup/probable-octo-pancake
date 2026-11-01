import { Link } from "wouter";
import { AlertCircle, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel max-w-md w-full p-8 md:p-12 rounded-3xl text-center border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)] relative z-10"
      >
        <div className="w-20 h-20 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-10 h-10" />
        </div>
        
        <h1 className="text-6xl font-display font-bold text-white mb-4 tracking-tighter">404</h1>
        <p className="text-xl font-medium text-zinc-300 mb-2">Page Not Found</p>
        <p className="text-zinc-500 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all hover:-translate-y-1"
        >
          <Home className="w-5 h-5" /> Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
