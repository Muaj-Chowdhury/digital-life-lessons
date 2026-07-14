import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import SocialLogin from "../../component/SocialLogin/SocialLogin";
import { imageUpload, saveOrUpdateUser } from "../../../utils";
import Swal from "sweetalert2";
import { Eye, EyeOff, User, Mail, Lock, Camera } from "lucide-react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const { createUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const handleRegister = async (data) => {
    const { name, email, password } = data;
    try {
      await createUser(email, password);
      let imageUrl = ""; 
      
      if (data.photo && data.photo.length > 0) {
        imageUrl = await imageUpload(data.photo[0]);
      }

      const savedUser = { name, email, image: imageUrl };
      await saveOrUpdateUser(savedUser);
      await updateUser({ displayName: name, photoURL: imageUrl });

      Swal.fire({
        icon: "success",
        title: "Identity Created!",
        text: "Welcome to the collective.",
        timer: 2000,
        showConfirmButton: false
      });
      navigate(location.state || "/");
    } catch (error) {
      Swal.fire({ icon: "error", title: "Registration Failed", text: error.message });
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center p-4 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-2xl rounded-[2.5rem] border border-base-300">
        <div className="p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black italic tracking-tighter text-base-content">
              Join <span className="text-primary">Today</span>
            </h1>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mt-2">
              Start sharing your wisdom
            </p>
          </div>

          <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
            {/* Name */}
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase tracking-widest opacity-60">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                  type="text"
                  placeholder="John Doe"
                  className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 border-none font-bold text-sm focus:ring-2 ring-primary/20"
                  {...register("name", { required: "Name is required" })}
                />
              </div>
            </div>

            {/* Photo */}
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase tracking-widest opacity-60">Profile Picture</label>
              <div className="relative">
                <Camera className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                  type="file"
                  className="file-input file-input-ghost w-full pl-12 rounded-2xl bg-base-200 border-none font-bold text-xs"
                  {...register("photo")}
                />
              </div>
            </div>

            {/* Email */}
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase tracking-widest opacity-60">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="input input-bordered w-full pl-12 rounded-2xl bg-base-200 border-none font-bold text-sm focus:ring-2 ring-primary/20"
                  {...register("email", { required: "Email is required" })}
                />
              </div>
            </div>

            {/* Password with Validation */}
            <div className="form-control">
              <label className="label text-[10px] font-black uppercase tracking-widest opacity-60">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input input-bordered w-full pl-12 pr-12 rounded-2xl bg-base-200 border-none font-bold text-sm focus:ring-2 ring-primary/20"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "At least 6 characters" },
                    pattern: {
                      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
                      message: "Must include uppercase, lowercase, and a number"
                    }
                  })}
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

            <button className="btn btn-primary w-full h-14 rounded-2xl font-black uppercase tracking-widest text-[10px] mt-4 shadow-lg shadow-primary/20 border-none">
              Register Account
            </button>
          </form>

          <p className="text-center mt-8 text-xs font-bold opacity-60">
            Member already?{" "}
            <Link to="/login" className="text-primary hover:underline">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;