import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import SocialLogin from "../../component/SocialLogin/SocialLogin";
import { saveOrUpdateUser } from "../../../utils";
import Swal from "sweetalert2";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleLogin = async (data) => {
    const { email, password } = data;
    try {
      const result = await signIn(email, password);
      const userData = {
        name: result.user.displayName,
        email: result.user.email,
        image: result.user.photoURL,
      };
      await saveOrUpdateUser(userData);
      
      Swal.fire({
        icon: "success",
        title: "Welcome Back!",
        text: "Redirecting to your dashboard...",
        timer: 1500,
        showConfirmButton: false,
      });
      navigate(location?.state || "/");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Login Failed",
        text: "Invalid email or password. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl rounded-[2.5rem] border border-base-300 overflow-hidden">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black italic tracking-tighter text-base-content">
              Digital <span className="text-primary">Life Lessons</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-2">
              Unlock Your Potential
            </p>
          </div>

          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            {/* Email Field */}
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase tracking-widest opacity-60">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                  type="email"
                  placeholder="name@example.com"
                  className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 border-none font-bold text-sm focus:ring-2 ring-primary/20"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
              {errors.email && <p className="text-error text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div className="form-control">
              <div className="flex justify-between items-end mb-1">
                <label className="label p-0 text-[10px] font-black uppercase tracking-widest opacity-60">Password</label>
                <Link className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-12 pr-12 rounded-2xl bg-base-200 border-none font-bold text-sm focus:ring-2 ring-primary/20"
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 transition-opacity"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-error text-[10px] font-bold mt-1 uppercase tracking-tighter">{errors.password.message}</p>}
            </div>

            <button className="btn btn-primary w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 border-none">
              Sign In
            </button>
          </form>

          <div className="divider text-[10px] font-black uppercase tracking-[0.2em] opacity-30 my-8">Or continue with</div>
          
          <SocialLogin />

          <p className="text-center mt-8 text-xs font-bold opacity-60">
            Don't have an account?{" "}
            <Link to="/register" state={location.state} className="text-primary hover:underline">Register Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;