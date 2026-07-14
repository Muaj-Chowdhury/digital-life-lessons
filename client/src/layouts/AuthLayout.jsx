import React from "react";
import DigitalLifeLessonsLogo from "../component/Logo/DigitalLifeLessonsLogo";
import { Outlet, Link } from "react-router";

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-base-200 relative overflow-hidden">
      {/* --- Aesthetic Background Elements --- */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        {/* --- Header / Navigation --- */}
        <header className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-2 bg-base-100 rounded-2xl shadow-sm border border-base-300 group-hover:border-primary/50 transition-colors">
              <DigitalLifeLessonsLogo className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl font-black italic tracking-tighter leading-none text-base-content">
                Digital Life <br /> 
                <span className="text-primary not-italic uppercase text-[10px] tracking-[0.3em] opacity-50">Lessons</span>
              </h1>
            </div>
          </Link>
        </header>

        {/* --- Main Content Area --- */}
        <main className="flex justify-center items-center min-h-[calc(100vh-120px)] w-full">
          <div className="w-full flex justify-center py-10 animate-in fade-in zoom-in-95 duration-500">
            <Outlet />
          </div>
        </main>

        {/* --- Footer / Legal --- */}
        <footer className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-20">
            &copy; {new Date().getFullYear()} Digital Life Lessons • Secured Infrastructure
          </p>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;