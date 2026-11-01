import { Link } from "wouter";
import { motion } from "framer-motion";
import { Flame, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  const games = [
    {
      id: "mlbb",
      title: "Mobile Legends",
      subtitle: "Diamond Top Up",
      image: `${import.meta.env.BASE_URL}images/mlbb-banner.png`,
      accent: "from-blue-600 to-indigo-600",
      shadow: "shadow-blue-500/20"
    },
    {
      id: "freefire",
      title: "Free Fire",
      subtitle: "Diamond Top Up",
      image: `${import.meta.env.BASE_URL}images/freefire-banner.png`,
      accent: "from-orange-500 to-red-600",
      shadow: "shadow-orange-500/20"
    },
    {
      id: "license",
      title: "Mobile License",
      subtitle: "Premium Keys",
      image: `${import.meta.env.BASE_URL}images/license-banner.png`,
      accent: "from-yellow-500 to-amber-600",
      shadow: "shadow-yellow-500/20",
      href: "/mobile-license"
    }
  ];

  return (
    <div className="w-full flex-1">
      {/* Hero Section */}
      <section className="relative w-full min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`}
            alt="Gaming Abstract Background" 
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary mb-6">
              <Zap className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold tracking-wider uppercase">Instant Delivery via KHQR</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/60 mb-6 drop-shadow-2xl">
              LEVEL UP YOUR GAME <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary text-glow">IN SECONDS</span>
            </h1>
            
            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10">
              The most trusted and fastest gaming top-up platform. 
              Pay securely with ABA and receive your diamonds instantly.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <a href="#games" className="px-8 py-4 rounded-xl font-bold bg-gradient-to-r from-primary to-secondary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
                Top Up Now
              </a>
              <div className="flex items-center gap-2 px-6 py-4 rounded-xl glass-panel text-zinc-300">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span>100% Safe & Secure</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Games Selection */}
      <section id="games" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4">Select Your Game</h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full box-glow" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {games.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link 
                href={game.href || `/game/${game.id}`}
                className={`group block relative rounded-3xl overflow-hidden glass-panel border border-white/10 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 ${game.shadow} hover:shadow-2xl`}
              >
                <div className="aspect-[4/3] w-full relative overflow-hidden">
                  <img 
                    src={game.image} 
                    alt={game.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent" />
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-6">
                  <div className={`w-12 h-1 mb-4 rounded-full bg-gradient-to-r ${game.accent}`} />
                  <h3 className="text-2xl font-display font-bold text-white mb-1 group-hover:text-glow transition-all">{game.title}</h3>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Flame className="w-4 h-4 text-accent" />
                    <span>{game.subtitle}</span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
