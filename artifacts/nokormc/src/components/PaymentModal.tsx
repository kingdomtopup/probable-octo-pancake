import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCheckPaymentStatus, useCreateOrder, useCreatePayment } from "@workspace/api-client-react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/utils";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useLocation } from "wouter";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    game: 'mlbb' | 'freefire';
    playerId: string;
    serverId?: string;
    playerName?: string;
    productId: string;
    amount: number;
    price: number;
    productName: string;
  } | null;
}

export function PaymentModal({ isOpen, onClose, orderData }: PaymentModalProps) {
  const [, setLocation] = useLocation();
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();

  // Status polling
  const { data: statusData, isError: statusError } = useCheckPaymentStatus(transactionId || "", {
    query: {
      enabled: !!transactionId && isOpen,
      refetchInterval: (query) => {
        const state = query.state.data?.status;
        if (state === 'success' || state === 'failed' || state === 'expired') return false;
        return 3000; // Poll every 3 seconds
      }
    }
  });

  useEffect(() => {
    if (isOpen && orderData && !transactionId && !createOrderMutation.isPending) {
      handleGeneratePayment();
    }
  }, [isOpen, orderData]);

  useEffect(() => {
    if (statusData?.status === 'success') {
      setTimeout(() => {
        setLocation(`/success?tx=${transactionId}`);
        onClose();
      }, 1500);
    }
  }, [statusData?.status]);

  const handleGeneratePayment = async () => {
    setError(null);
    try {
      if (!orderData) return;
      
      const order = await createOrderMutation.mutateAsync({
        data: {
          game: orderData.game,
          playerId: orderData.playerId,
          serverId: orderData.serverId,
          playerName: orderData.playerName,
          productId: orderData.productId,
          amount: orderData.amount,
          price: orderData.price
        }
      });

      const payment = await createPaymentMutation.mutateAsync({
        data: {
          amount: order.price,
          currency: "USD",
          orderId: order.id.toString(),
          description: `Top up ${order.amount} Diamonds`
        }
      });

      setTransactionId(payment.transactionId);
      setQrCode(payment.qrCode);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to generate payment. Please try again.");
    }
  };

  const isLoading = createOrderMutation.isPending || createPaymentMutation.isPending;
  const isSuccess = statusData?.status === 'success';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && !isSuccess && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-white/10 text-white shadow-2xl shadow-primary/20">
        <DialogTitle className="text-center text-2xl font-display border-b border-white/10 pb-4">
          Checkout securely with ABA
        </DialogTitle>
        
        <div className="py-6 flex flex-col items-center justify-center min-h-[300px]">
          {isLoading ? (
            <div className="flex flex-col items-center text-zinc-400">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p>Generating secure QR Code...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center text-red-400 text-center">
              <AlertCircle className="w-12 h-12 mb-4" />
              <p>{error}</p>
              <button 
                onClick={handleGeneratePayment}
                className="mt-6 px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-white"
              >
                Try Again
              </button>
            </div>
          ) : isSuccess ? (
            <div className="flex flex-col items-center text-green-400">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
              >
                <CheckCircle2 className="w-20 h-20 mb-4" />
              </motion.div>
              <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
              <p className="text-zinc-400">Delivering your diamonds instantly...</p>
            </div>
          ) : qrCode ? (
            <div className="flex flex-col items-center w-full">
              <div className="p-4 bg-white rounded-2xl shadow-xl mb-6">
                <QRCodeSVG 
                  value={qrCode} 
                  size={220}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: `${import.meta.env.BASE_URL}images/hero-bg.png`, // small logo overlay could go here, but using raw is safer
                    height: 40,
                    width: 40,
                    excavate: true,
                  }}
                />
              </div>
              
              <div className="w-full space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Order</span>
                  <span className="font-semibold">{orderData?.productName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-400">Player ID</span>
                  <span className="font-mono">{orderData?.playerId} {orderData?.serverId ? `(${orderData.serverId})` : ''}</span>
                </div>
                <div className="h-px w-full bg-white/10 my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Total Amount</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatCurrency(orderData?.price || 0, "USD")}
                  </span>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 text-sm text-zinc-400 bg-blue-500/10 text-blue-400 px-4 py-3 rounded-lg w-full justify-center border border-blue-500/20">
                <Loader2 className="w-4 h-4 animate-spin" />
                Waiting for payment...
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
