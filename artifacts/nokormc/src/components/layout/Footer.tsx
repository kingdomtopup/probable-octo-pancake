import { Facebook, MessageCircle, Youtube, Music2, MessagesSquare, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full glass-panel border-t border-white/5 mt-auto relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-center md:text-left">
          
          <div className="space-y-4">
            <span className="font-display font-bold text-3xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
              NOKOR<span className="text-primary">MC</span>
            </span>
            <p className="text-sm text-zinc-400 max-w-xs mx-auto md:mx-0">
              Premium top-up store for your favorite games. Fast, secure, and reliable with instant delivery via ABA KHQR.
            </p>
          </div>

          <div className="flex flex-col items-center space-y-4">
            <h4 className="font-display font-semibold text-lg text-white">Connect With Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 hover:-translate-y-1 transition-all duration-300">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-pink-500 hover:bg-pink-500/10 hover:-translate-y-1 transition-all duration-300">
                <Music2 className="w-5 h-5" /> {/* TikTok placeholder */}
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-sky-500 hover:bg-sky-500/10 hover:-translate-y-1 transition-all duration-300">
                <MessageCircle className="w-5 h-5" /> {/* Telegram placeholder */}
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-indigo-500 hover:bg-indigo-500/10 hover:-translate-y-1 transition-all duration-300">
                <MessagesSquare className="w-5 h-5" /> {/* Discord placeholder */}
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 hover:text-red-500 hover:bg-red-500/10 hover:-translate-y-1 transition-all duration-300">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end space-y-4">
            <h4 className="font-display font-semibold text-lg text-white">Support</h4>
            <a href="mailto:nokormc@gmail.com" className="flex items-center gap-2 text-zinc-400 hover:text-primary transition-colors">
              <Mail className="w-4 h-4" />
              nokormc@gmail.com
            </a>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm">
            &copy; {new Date().getFullYear()} NOKORMC. All rights reserved.
          </p>
          <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Created by <span className="text-white font-bold tracking-wide">KOB PANHA</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
