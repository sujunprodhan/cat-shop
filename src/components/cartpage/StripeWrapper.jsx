'use client';
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2, ArrowRight } from 'lucide-react';
import Swal from 'sweetalert2';

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY 
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) 
  : null;

const CheckoutForm = ({ amount, onPaymentSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required',
    });

    if (paymentError) {
      setError(paymentError.message);
      setProcessing(false);
      Swal.fire('Payment Failed', paymentError.message, 'error');
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      setProcessing(false);
      onPaymentSuccess(paymentIntent.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 transition-all duration-300">
        <PaymentElement 
          options={{
            layout: 'tabs',
          }}
        />
        {error && <p className="text-rose-500 text-[10px] font-black mt-3 ml-1">{error}</p>}
      </div>

      <div className="flex gap-4 pt-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={processing}
          className="w-1/3 bg-white/5 hover:bg-white/10 text-white font-bold py-4 rounded-xl transition-all border border-white/10"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!stripe || processing}
          className="w-2/3 group relative overflow-hidden bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white py-4 rounded-xl font-black text-lg transition-all duration-300 flex items-center justify-center shadow-lg shadow-blue-950/40 active:scale-[0.98]"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          <span className="relative z-10 flex items-center gap-3 uppercase tracking-widest text-sm">
            {processing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing...
              </>
            ) : (
              <>
                Pay ${amount.toLocaleString()}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform duration-300" />
              </>
            )}
          </span>
        </button>
      </div>
    </form>
  );
};

export default function StripeWrapper({ amount, onPaymentSuccess, onCancel }) {
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret));
  }, [amount]);

  if (!stripePromise) {
    return (
      <div className="mt-8 p-4 bg-rose-500/10 text-rose-400 rounded-xl border border-rose-500/20 font-bold text-sm text-center">
        Stripe API Keys are missing in your .env file!
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="mt-8 py-10 flex flex-col items-center justify-center text-slate-400 gap-3 border border-white/5 rounded-2xl bg-white/5">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-xs font-bold uppercase tracking-widest">Initializing Payment...</p>
      </div>
    );
  }

  return (
    <div className="pt-6 border-t border-white/5">
      <h3 className="text-slate-500 font-black text-[10px] uppercase tracking-widest mb-4">Complete Your Payment</h3>
      <Elements 
        stripe={stripePromise} 
        options={{ 
          clientSecret,
          appearance: {
            theme: 'night',
            variables: {
              colorPrimary: '#3b82f6',
              colorBackground: 'transparent',
              colorText: '#ffffff',
              colorDanger: '#ef4444',
              fontFamily: 'Inter, sans-serif',
              borderRadius: '8px',
            },
            rules: {
              '.Input': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
              },
              '.Input:focus': {
                border: '1px solid rgba(59, 130, 246, 0.5)',
              }
            }
          }
        }}
      >
        <CheckoutForm amount={amount} onPaymentSuccess={onPaymentSuccess} onCancel={onCancel} />
      </Elements>
    </div>
  );
}
