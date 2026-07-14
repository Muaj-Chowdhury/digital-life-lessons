import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ShieldCheck, Edit3, Camera, Lock, Save, X, Flag } from "lucide-react";
import { toast } from "react-toastify";
import { updatePassword } from "firebase/auth";
import axios from "axios";

import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth"; // Access firebase user
import Loading from "../../../../component/shared/Loading";

// Image Upload Helper
const imageUpload = async (imageData) => {
  const formData = new FormData();
  formData.append("image", imageData);
  const { data } = await axios.post(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    formData
  );
  return data?.data?.display_url;
};

export default function AdminProfile() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { user } = useAuth(); // Firebase user

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Form States
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("");

  const { data: admin, isLoading } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/profile");
      return res.data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-profile-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/profile/stats");
      return res.data;
    },
  });

  // Handle Image Preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = admin.image;

      // 1. Upload to ImgBB if new file selected
      if (selectedFile) {
        finalImageUrl = await imageUpload(selectedFile);
      }

      // 2. Update Firebase Password (if provided)
      if (newPassword) {
        if (newPassword.length < 6) throw new Error("Password too short");
        await updatePassword(user, newPassword);
      }

      // 3. Update DB Profile
      await axiosSecure.patch("/admin/profile", {
        name: newName || admin.name,
        image: finalImageUrl,
      });

      queryClient.invalidateQueries(["admin-profile"]);
      toast.success("Profile fully updated!");
      setIsModalOpen(false);
      setNewPassword("");
    } catch (err) {
      toast.error(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) return <Loading />;

  return (
<div className="min-h-screen bg-base-100 p-4 md:p-10 max-w-6xl mx-auto space-y-10 animate-in fade-in duration-700">
  
  {/* ---------- HERO SECTION: HIGH CONTRAST ---------- */}
  <div className="relative overflow-hidden bg-neutral rounded-[2.5rem] p-8 md:p-12 text-neutral-content shadow-2xl shadow-base-content/10">
    <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
      {/* Profile Image with Squircle Mask */}
      <div className="relative group">
        <div className="mask mask-squircle w-36 h-36 bg-base-100/10 p-1 backdrop-blur-md">
          <img
            src={admin?.image}
            className="mask mask-squircle w-full h-full object-cover shadow-2xl"
            alt="Admin"
          />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-accent text-accent-content p-2 rounded-xl shadow-lg border-4 border-neutral">
          <ShieldCheck size={20} />
        </div>
      </div>

      <div className="text-center md:text-left space-y-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 text-accent text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-accent/30">
            System Administrator
          </div>
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter text-white">
            {admin?.name}
          </h2>
          <p className="text-neutral-content/60 font-bold tracking-wide flex items-center justify-center md:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
            {admin?.email}
          </p>
        </div>

        <button 
          onClick={() => {
            setNewName(admin.name);
            setIsModalOpen(true);
          }}
          className="btn btn-md btn-primary rounded-2xl px-8 font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 transition-all hover:scale-105 active:scale-95 border-none"
        >
          <Edit3 size={16} /> Edit Profile Settings
        </button>
      </div>
    </div>

    {/* Abstract Background Accents for Depth */}
    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full -mr-20 -mt-20 blur-[100px]" />
    <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full -ml-20 -mb-20 blur-[80px]" />
  </div>

  {/* ---------- STATS GRID: CLEAN CONTRAST ---------- */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    <StatCard icon={<Edit3 size={20}/>} label="Lessons Reviewed" value={stats?.lessonsReviewed || 0} accent="bg-primary/10 text-primary" />
    <StatCard icon={<Flag size={20}/>} label="Reports Handled" value={stats?.reportsHandled || 0} accent="bg-error/10 text-error" />
    <StatCard icon={<Lock size={20}/>} label="Security Actions" value={stats?.lessonsDeleted || 0} accent="bg-warning/10 text-warning" />
  </div>

  {/* ---------- MODAL: UPDATED COLORS ---------- */}
  <input type="checkbox" checked={isModalOpen} className="modal-toggle" readOnly />
  <div className="modal modal-bottom sm:modal-middle backdrop-blur-md">
    <div className="modal-box bg-base-100 border border-base-300 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
      <div className="bg-base-200/80 p-6 flex justify-between items-center border-b border-base-300">
        <div>
          <h3 className="font-black text-xl italic tracking-tighter text-base-content">
            Security <span className="text-primary">Settings</span>
          </h3>
          <p className="text-[10px] font-black uppercase opacity-40 tracking-widest">Update Admin Credentials</p>
        </div>
        <button onClick={() => setIsModalOpen(false)} className="btn btn-ghost btn-circle btn-sm">
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleUpdate} className="p-10 space-y-8">
        {/* Avatar Upload Container */}
        <div className="flex flex-col items-center gap-6">
           <div className="relative">
              <div className="mask mask-squircle w-28 h-28 bg-base-200 p-1 border-2 border-primary shadow-inner">
                <img src={preview || admin.image} className="mask mask-squircle object-cover" />
              </div>
              <label className="absolute -bottom-2 -right-2 btn btn-circle btn-primary btn-sm border-2 border-base-100 shadow-xl cursor-pointer">
                <Camera size={14} />
                <input type="file" hidden onChange={handleFileChange} accept="image/*" />
              </label>
           </div>
           <p className="text-[10px] font-black uppercase opacity-30">Tap camera icon to change avatar</p>
        </div>

        <div className="space-y-5">
          <div className="form-control w-full">
            <label className="label py-0 mb-2 font-black text-[10px] uppercase tracking-widest text-base-content/40">Legal Full Name</label>
            <input 
              type="text" 
              value={newName}
              onChange={e => setNewName(e.target.value)}
              className="input input-bordered h-12 w-full rounded-xl bg-base-200/50 border-base-300 font-bold focus:border-primary transition-all" 
            />
          </div>

          <div className="form-control w-full">
            <label className="label py-0 mb-2 font-black text-[10px] uppercase tracking-widest text-base-content/40">Credential Refresh (Password)</label>
            <input 
              type="password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              className="input input-bordered h-12 w-full rounded-xl bg-base-200/50 border-base-300 font-bold focus:border-primary transition-all" 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-2xl shadow-primary/20 gap-3 border-none"
        >
          {loading ? <span className="loading loading-spinner" /> : <Save size={18} />}
          Apply Security Updates
        </button>
      </form>
    </div>
  </div>
</div>
  );
}

function StatCard({ label, value, icon, color }) {
  return (
    <div className="bg-base-100 border border-base-300 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-3 w-fit rounded-2xl bg-base-200 mb-4 ${color}`}>
        {icon}
      </div>
      <p className="text-3xl font-black text-base-content">{value}</p>
      <p className="text-sm font-bold text-base-content/40 uppercase tracking-tighter">{label}</p>
    </div>
  );
}

