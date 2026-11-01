import { useParams } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import { useGetProducts, useVerifyPlayerId } from "@workspace/api-client-react";
import { UserCircle2, Loader2, Check, ShieldAlert, Info, Gamepad2, ChevronRight, Gem } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { PaymentModal } from "@/components/PaymentModal";

export default function GameTopUp() {
  const params = useParams();
  const game = params.id as 'mlbb' | 'freefire';
  
  const [playerId, setPlayerId] = useState("");
  const [serverId, setServerId] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  const { data: productData, isLoading: isLoadingProducts } = useGetProducts(
    { game },
    { query: { enabled: !!game } }
  );

  const verifyMutation = useVerifyPlayerId();

  const handleVerify = async () => {
    if (!playerId) return;
    if (game === 'mlbb' && !serverId) return;
    
    try {
      const res = await verifyMutation.mutateAsync({
        data: { game, playerId, serverId: serverId || undefined }
      });
      if (res.valid) {
        setIsVerified(true);
        setPlayerName(res.playerName || "Verified Player");
      }
    } catch (err) {
      console.error(err);
      setIsVerified(false);
      setPlayerName("");
    }
  };

  const handlePlayerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerId(e.target.value);
    setIsVerified(false);
  };

  const handleServerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerId(e.target.value);
    setIsVerified(false);
  };

  const gameInfo = {
    mlbb: {
      name: "Mobile Legends: Bang Bang",
      banner: `${import.meta.env.BASE_URL}images/mlbb-banner.png`,
      theme: "primary"
    },
    freefire: {
      name: "Free Fire",
      banner: `${import.meta.env.BASE_URL}images/freefire-banner.png`,
      theme: "orange-500"
    }
  }[game] || { name: "Unknown Game", banner: "", theme: "primary" };

  const products = productData?.products || [];
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const canCheckout = isVerified && selectedProduct;

  const orderData = selectedProduct ? {
    game,
    playerId,
    serverId: serverId || undefined,
    playerName,
    productId: selectedProduct.id,
    productName: selectedProduct.name,
    amount: selectedProduct.amount,
    price: selectedProduct.price,
  } : null;

  return (
    <div className="flex-1 w-full bg-background pb-32">
      {/* Game Header Banner */}
      <div className="relative h-[250px] md:h-[350px] w-full overflow-hidden">
        <img 
          src={gameInfo.banner} 
          alt={gameInfo.name} 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute bottom-0 left-0 w-full px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-white drop-shadow-lg text-glow">
              {gameInfo.name}
            </h1>
            <p className="text-zinc-300 mt-2 text-lg">Instant delivery • Secure payment</p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Form Content */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Step 1: Account Info */}
            <motion.section 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
              className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold font-display">1</div>
                <h2 className="text-2xl font-display font-bold text-white">Enter Account Details</h2>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 space-y-2">
                  <label className="text-sm font-medium text-zinc-400">Player ID</label>
                  <input
                    type="text"
                    value={playerId}
                    onChange={handlePlayerIdChange}
                    placeholder="Enter Player ID"
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                  />
                </div>
                
                {game === 'mlbb' && (
                  <div className="flex-1 space-y-2">
                    <label className="text-sm font-medium text-zinc-400">Server ID</label>
                    <input
                      type="text"
                      value={serverId}
                      onChange={handleServerIdChange}
                      placeholder="e.g., 1234"
                      className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    />
                  </div>
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4 justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isVerified ? "bg-green-500/20 text-green-400" : "bg-zinc-800 text-zinc-500"
                  )}>
                    {isVerified ? <Check className="w-5 h-5" /> : <UserCircle2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Player Name</p>
                    {isVerified ? (
                      <p className="font-bold text-white tracking-wide">{playerName}</p>
                    ) : (
                      <p className="text-zinc-600 italic">Not verified</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={handleVerify}
                  disabled={verifyMutation.isPending || !playerId || (game === 'mlbb' && !serverId)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {verifyMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Check ID
                </button>
              </div>
              {verifyMutation.isError && (
                <p className="text-red-400 text-sm mt-3 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Invalid ID. Please check your details.
                </p>
              )}
            </motion.section>

            {/* Step 2: Select Product */}
            <motion.section 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
              className="glass-panel p-6 sm:p-8 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-secondary" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold font-display">2</div>
                <h2 className="text-2xl font-display font-bold text-white">Select Recharge</h2>
              </div>

              {isLoadingProducts ? (
                <div className="py-12 flex flex-col items-center justify-center text-zinc-500">
                  <Loader2 className="w-10 h-10 animate-spin text-secondary mb-4" />
                  <p>Loading packages...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                  {products.map((product) => (
                    <button
                      key={product.id}
                      onClick={() => setSelectedProductId(product.id)}
                      className={cn(
                        "relative p-4 rounded-xl border flex flex-col items-center text-center transition-all duration-300",
                        selectedProductId === product.id
                          ? "bg-primary/10 border-primary shadow-[0_0_20px_rgba(124,58,237,0.3)] -translate-y-1"
                          : "bg-black/20 border-white/10 hover:border-white/30 hover:bg-white/5"
                      )}
                    >
                      <Gem className={cn("w-8 h-8 mb-2", selectedProductId === product.id ? "text-primary" : "text-zinc-400")} />
                      <span className="font-bold text-white text-lg">{product.amount}</span>
                      <span className="text-xs text-zinc-400 mb-2">{product.name}</span>
                      
                      {product.bonus && (
                        <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-lg">
                          +{product.bonus}
                        </span>
                      )}
                      
                      <div className="w-full pt-2 mt-auto border-t border-white/10">
                        <span className="text-sm font-semibold text-secondary">
                          {formatCurrency(product.price, product.currency)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.section>

          </div>

          {/* Sidebar / Checkout Summary */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
              className="glass-panel p-6 rounded-2xl sticky top-24 border border-white/10"
            >
              <h3 className="text-xl font-display font-bold text-white mb-6 border-b border-white/10 pb-4">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Account</span>
                  <span className="font-medium text-white truncate max-w-[150px]">
                    {isVerified ? playerName : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Item</span>
                  <span className="font-medium text-white">
                    {selectedProduct ? selectedProduct.name : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Payment Method</span>
                  <span className="font-medium text-white flex items-center gap-1">
                    ABA KHQR
                  </span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mb-8">
                <div className="flex justify-between items-end">
                  <span className="text-zinc-400">Total Payment</span>
                  <span className="text-3xl font-bold text-primary text-glow">
                    {selectedProduct ? formatCurrency(selectedProduct.price, selectedProduct.currency) : "$0.00"}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsPaymentOpen(true)}
                disabled={!canCheckout}
                className={cn(
                  "w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all duration-300",
                  canCheckout 
                    ? "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] hover:-translate-y-1" 
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                )}
              >
                Buy Now <ChevronRight className="w-5 h-5" />
              </button>

              {!isVerified && (
                <p className="text-xs text-center text-red-400 mt-4 flex items-center justify-center gap-1">
                  <Info className="w-3 h-3" /> Please verify Player ID first
                </p>
              )}
            </motion.div>
          </div>

        </div>
      </div>

      <PaymentModal 
        isOpen={isPaymentOpen} 
        onClose={() => setIsPaymentOpen(false)} 
        orderData={orderData} 
      />
    </div>
  );
}
