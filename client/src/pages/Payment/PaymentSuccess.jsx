import React, { useEffect } from "react";
import Lottie from "lottie-react";
import successAnimation from "../../assets/payment-success.json";
import { Link, useLocation, useNavigate } from "react-router";
import Confetti from 'react-confetti';
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import { Sparkles, ArrowRight, LayoutDashboard } from "lucide-react";

const PaymentSuccess = () => {
  const location = useLocation();
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const sessionId = queryParams.get("session_id");

  const { data: isPremium, isLoading, refetch } = useQuery({
    queryKey: ["user-access", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure(`/users/${user?.email}`);
      return res.data?.isPremium;
    },
    retry: 3,
    retryDelay: 2000,
  });

  useEffect(() => {
    if (!isLoading && sessionId && !isPremium) {
      const timeout = setTimeout(() => {
        refetch().then((result) => {
          if (!result.data) navigate("/");
        });
      }, 5000); 
      return () => clearTimeout(timeout);
    }
  }, [isPremium, isLoading, sessionId, navigate, refetch]);

  if (isLoading) return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center gap-4">
      <span className="loading loading-ring loading-lg text-primary"></span>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-40">Verifying Transaction</p>
    </div>
  );

  if (!sessionId || !isPremium) {
    return (
      <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center text-center p-6">
        <div className="p-4 rounded-full bg-error/10 text-error mb-4">
          <X size={32} />
        </div>
        <h1 className="text-3xl font-black italic tracking-tighter text-base-content">Access Denied</h1>
        <p className="text-sm font-medium opacity-50 mt-2">Status: Verification Timeout</p>
      </div>
    );}

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 relative overflow-hidden">
      <Confetti recycle={false} numberOfPieces={300} gravity={0.1} colors={['#641ae6', '#d926aa', '#37cdbe']} />
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-md w-full bg-base-100 p-10 rounded-[3rem] border border-base-300 shadow-2xl text-center relative z-10">
        <div className="w-56 h-56 mx-auto -mt-10">
          <Lottie animationData={successAnimation} loop={false} />
        </div>
        
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-success/10 text-success text-[9px] font-black uppercase tracking-widest mb-4">
          <Sparkles size={12} /> Membership Verified
        </div>

        <h1 className="text-4xl font-black italic tracking-tighter text-base-content leading-none">
          Legacy <span className="text-primary">Unlocked</span>
        </h1>
        <p className="text-sm font-medium text-base-content/60 mt-6 leading-relaxed">
          Welcome to the **Premium Circle**. Your account now holds lifetime status with unlimited access to all wisdom.
        </p>

        <div className="mt-10 space-y-3">
          <Link 
            to="/dashboard" 
            className="btn btn-primary btn-block h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20"
          >
            <LayoutDashboard size={16} /> Enter Dashboard
          </Link>
          <Link 
            to="/public-lessons" 
            className="btn btn-ghost btn-block h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] opacity-60 hover:opacity-100"
          >
            Explore Premium Feed <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};
export default PaymentSuccess;