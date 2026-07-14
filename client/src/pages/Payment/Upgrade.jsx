import React from "react";
import { CheckCircle, Zap, ShieldCheck, Sparkles, X } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const features = [
  "Unlimited lesson access",
  "Create premium lessons",
  "Ad-free experience",
  "Priority lesson visibility",
  "Advanced analytics",
  "Lifetime access",
  "Premium support",
  "Early feature access",
];

const Upgrade = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const handleCheckout = async () => {
    try {
      const res = await axiosSecure.post("/create-checkout-session", {
        userEmail: user?.email,
      });
      window.location.href = res.data.url;
    } catch (error) {
      console.error("Payment initiation failed", error);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-20 px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Sparkles size={14} /> Pricing & Plans
          </div>
          <h1 className="text-5xl md:text-6xl font-black italic tracking-tighter text-base-content mb-6">
            Elevate Your <span className="text-primary">Wisdom</span>
          </h1>
          <p className="max-w-xl mx-auto text-base-content/60 font-medium leading-relaxed">
            Unlock professional-grade tools and join an elite circle of digital creators with our one-time lifetime pass.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto items-center">
          
          {/* FREE PLAN */}
          <div className="bg-base-100/50 backdrop-blur-md rounded-[2.5rem] p-10 border border-base-300 shadow-xl opacity-80 group hover:opacity-100 transition-all duration-500">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-base-content/40 mb-2">Standard</h2>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-black italic tracking-tighter text-base-content">৳0</span>
              <span className="text-xs font-bold opacity-30 uppercase tracking-widest">Free Forever</span>
            </div>

            <ul className="space-y-4 mb-10 border-t border-base-300 pt-8">
              <li className="flex items-center gap-3 text-sm font-bold opacity-60">
                <CheckCircle className="text-success w-5 h-5" /> Limited Lessons
              </li>
              <li className="flex items-center gap-3 text-sm font-bold opacity-60">
                <CheckCircle className="text-success w-5 h-5" /> Basic Access
              </li>
              <li className="flex items-center gap-3 text-sm font-bold opacity-30 line-through decoration-error/50">
                <X className="text-error w-5 h-5" /> Ads Removed
              </li>
              <li className="flex items-center gap-3 text-sm font-bold opacity-30 line-through decoration-error/50">
                <X className="text-error w-5 h-5" /> Premium Creation
              </li>
            </ul>

            <button className="btn btn-block h-14 rounded-2xl border-base-300 bg-base-200 text-base-content/40 cursor-not-allowed font-black uppercase tracking-widest text-[10px]">
              Current Tier
            </button>
          </div>

          {/* PREMIUM PLAN */}
          <div className="relative bg-base-100 rounded-[3rem] p-12 border-[3px] border-primary shadow-2xl shadow-primary/10 scale-105 z-20 overflow-hidden group">
            {/* Animated Glow Effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
            
            <div className="absolute top-6 right-8">
              <div className="badge badge-primary font-black uppercase tracking-[0.2em] text-[8px] py-3 px-4 rounded-full italic">
                Most Popular
              </div>
            </div>

            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-primary mb-2">Lifetime Pro</h2>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-5xl font-black italic tracking-tighter text-base-content">৳1500</span>
              <span className="text-xs font-bold opacity-30 uppercase tracking-widest">One-time</span>
            </div>
            <p className="text-[10px] font-bold opacity-40 uppercase tracking-widest mb-8 italic">Full Platform Autonomy</p>

            <ul className="space-y-4 mb-10 border-t border-primary/10 pt-8">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-bold text-base-content/80 group-hover:translate-x-1 transition-transform duration-300">
                  <div className="bg-primary/10 p-1 rounded-md">
                    <CheckCircle className="text-primary w-4 h-4" />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <button
              onClick={handleCheckout}
              className="btn btn-primary btn-block h-16 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-primary/30 group-hover:scale-[1.02] transition-all"
            >
              <Zap size={16} fill="currentColor" /> Upgrade to Pro
            </button>
            
            <p className="text-[9px] font-black uppercase tracking-widest text-center mt-6 opacity-30 flex items-center justify-center gap-2">
              <ShieldCheck size={12} /> Secure Infrastructure Deployment
            </p>
          </div>
        </div>

        {/* Brand/Stripe Logo Footer */}
        <div className="mt-20 flex flex-col items-center gap-4 opacity-30">
           <div className="flex items-center gap-8 grayscale brightness-0 invert">
              {/* If you have a Stripe logo asset, place it here */}
              <p className="text-xs font-black uppercase tracking-[0.4em]">Powered by Stripe</p>
           </div>
           <p className="text-[10px] font-bold italic">No recurring fees. No hidden costs. Pure wisdom.</p>
        </div>
      </div>
    </div>
  );
};

export default Upgrade;