import React from 'react';
import { Link } from 'react-router';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const PaymentCancel = () => {
    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 relative">
            <div className="max-w-md w-full bg-base-100 border border-base-300 shadow-2xl rounded-[3rem] p-12 text-center overflow-hidden">
                
                <div className="flex justify-center mb-8">
                    <div className="relative">
                        <XCircle className="text-error w-24 h-24 opacity-20" />
                        <XCircle className="text-error w-20 h-20 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                    </div>
                </div>
                
                <h1 className="text-4xl font-black italic tracking-tighter text-base-content mb-4">
                    Flow <span className="text-error">Interrupted</span>
                </h1>
                <p className="text-sm font-medium text-base-content/50 mb-10 leading-relaxed">
                    No changes were made to your account. Your transaction was safely stopped. You can revisit the upgrade path whenever you feel ready.
                </p>

                <div className="space-y-4">
                    <Link 
                        to="/upgrade" 
                        className="btn btn-neutral btn-block h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] group"
                    >
                        <RefreshCw size={16} className="group-hover:rotate-180 transition-transform duration-500" /> 
                        Restart Process
                    </Link>
                    <Link 
                        to="/" 
                        className="btn btn-ghost btn-block h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] opacity-40 hover:opacity-100"
                    >
                        <ArrowLeft size={16} /> Return to Sanctum
                    </Link>
                </div>

                {/* Decorative border accent */}
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-error/20 to-transparent"></div>
            </div>
        </div>
    );
};

export default PaymentCancel;