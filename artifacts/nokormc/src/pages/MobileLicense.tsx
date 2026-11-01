import { motion } from "framer-motion";
import { Lock, Sparkles } from "lucide-react";

export default function MobileLicense() {
  return (
    <div className="flex-1 w-full flex items-center justify-center py-24 px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel max-w-lg w-full p-12 rounded-3xl border border-accent/20 text-center relative z-10"
      >
        <div className="w-20 h-20 mx-auto bg-accent/20 text-accent rounded-2xl flex items-center justify-center mb-8 box-glow">
          <Lock className="w-10 h-10" />
        </div>
        
        <h1 className="text-4xl font-display font-bold text-white mb-4">Mobile License</h1>
        <p className="text-zinc-400 text-lg mb-8">
          Premium digital software licenses are coming soon. We are preparing the best deals for you!
        </p>

        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 text-white font-medium">
          <Sparkles className="w-5 h-5 text-accent" />
          Stay Tuned
        </div>
      </motion.div>
    </div>
  );
}
