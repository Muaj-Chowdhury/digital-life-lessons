import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { 
  ChevronDown, 
  Heart, 
  X, 
  Calendar, 
  Tag, 
  ExternalLink, 
  Trash2,
  Filter,
  Sparkles
} from "lucide-react";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Loading from "../../../component/shared/Loading";

const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const emotionalTones = ["Motivational", "Sad", "Realization", "Gratitude"];

const MyFavorites = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTone, setSelectedTone] = useState("");
  const [filter, setFilter] = useState({ category: "", tone: "" });

  const { data: favorites = [], isLoading, refetch } = useQuery({
    queryKey: ["my-favorites", user?.email, filter.category, filter.tone],
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/favorites/${user?.email}?category=${filter.category}&tone=${filter.tone}`
      );
      return res.data;
    },
    enabled: !!user?.email,
  });

  const handleFilterChange = (type, value) => {
    const newFilters = { ...filter, [type]: value };
    if (type === "category") setSelectedCategory(value);
    if (type === "tone") setSelectedTone(value);
    setFilter(newFilters);
  };

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedTone("");
    setFilter({ category: "", tone: "" });
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Remove from Favorites?",
      text: "You can always add this lesson back later.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, remove it!",
      background: "var(--b1)",
      color: "var(--bc)",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/favorites/delete/${id}`, {
            data: { userEmail: user?.email },
          });

          if (res.data.success) {
            refetch();
            toast.success("Removed from favorites");
          }
        } catch (error) {
          toast.error("Failed to remove lesson");
        }
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="min-h-screen bg-base-100 p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
  
  {/* Header Section with Collection Identity */}
  <div className="relative overflow-hidden bg-gradient-to-r from-secondary/10 to-transparent p-8 rounded-[2.5rem] border border-secondary/10">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-[2px] bg-secondary"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-secondary">Library</span>
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter text-base-content">
          My <span className="text-secondary">Favorites</span>
        </h2>
        <p className="text-xs font-bold opacity-50 mt-2 max-w-xs leading-relaxed">
          Your curated sanctuary of saved insights and personal growth lessons.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="stats shadow-sm bg-base-100 border border-base-300 rounded-2xl">
          <div className="stat px-6 py-3">
            <div className="stat-title text-[10px] font-black uppercase">Saved Items</div>
            <div className="stat-value text-secondary text-2xl">{favorites.length}</div>
            <div className="stat-desc font-bold flex items-center gap-1">
               <Heart size={12} className="fill-secondary text-secondary" /> Collection
            </div>
          </div>
        </div>
      </div>
    </div>
    {/* Decorative blur element */}
    <div className="absolute -right-20 -top-20 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
  </div>

  {/* Refined Filters Bar */}
  <div className="flex flex-wrap items-center gap-6 p-6 bg-base-200/40 backdrop-blur-md border border-base-300 rounded-[2rem]">
    <div className="flex items-center gap-4 flex-1 min-w-[300px]">
      <div className="form-control w-full max-w-xs">
        <label className="label py-0 mb-1">
          <span className="label-text text-[9px] font-black uppercase opacity-40 tracking-widest flex items-center gap-1">
            <Tag size={10} /> Category
          </span>
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => handleFilterChange("category", e.target.value)}
          className="select select-sm bg-base-100 border-base-300 rounded-xl font-bold text-xs focus:outline-none focus:border-secondary transition-all"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label py-0 mb-1">
          <span className="label-text text-[9px] font-black uppercase opacity-40 tracking-widest flex items-center gap-1">
            <Sparkles size={10} /> Mood
          </span>
        </label>
        <select
          value={selectedTone}
          onChange={(e) => handleFilterChange("tone", e.target.value)}
          className="select select-sm bg-base-100 border-base-300 rounded-xl font-bold text-xs focus:outline-none focus:border-secondary transition-all"
        >
          <option value="">Any Mood</option>
          {emotionalTones.map((tone) => (
            <option key={tone} value={tone}>{tone}</option>
          ))}
        </select>
      </div>
    </div>

    {(selectedCategory || selectedTone) && (
      <button
        onClick={clearFilters}
        className="btn btn-ghost btn-sm text-error hover:bg-error/10 rounded-xl gap-2 font-black text-[10px] uppercase tracking-tighter"
      >
        <X size={14} /> Reset Filters
      </button>
    )}
  </div>

  {/* Sticky Table Wrapper */}
  <div className="bg-base-100 border border-base-300 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
    <div className="overflow-x-auto w-full custom-scrollbar">
      <table className="table-auto w-full min-w-max border-collapse">
        <thead className="bg-base-200/50">
          <tr className="text-left text-base-content/40 uppercase text-[10px] font-black tracking-[0.2em] border-b border-base-300">
            <th className="sticky left-0 z-30 bg-base-200/90 backdrop-blur-md p-6">Stored Wisdom</th>
            <th className="p-6 text-center">Emotional Tone</th>
            <th className="p-6">Preserved At</th>
            <th className=" z-30 bg-base-200/90 backdrop-blur-md p-6 text-center">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-base-300/30">
          {favorites.length > 0 ? (
            favorites.map((fav, index) => (
              <tr key={fav._id} className="hover:bg-secondary/[0.02] transition-all duration-300 group">
                
                {/* STICKY LESSON INFO */}
                <td className="sticky left-0 z-20 bg-base-100 group-hover:bg-base-200/50 transition-colors p-6 border-r border-base-300/50 shadow-[10px_0_20px_-10px_rgba(0,0,0,0.04)]">
                  <div className="flex items-center gap-5">
                    <span className="text-[10px] font-black opacity-10 w-4 group-hover:opacity-100 group-hover:text-secondary transition-all">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="mask mask-squircle w-12 h-12 bg-base-200 p-0.5 border border-base-300 group-hover:border-secondary/50 transition-all">
                      <img 
                        src={fav.image || "https://via.placeholder.com/150"} 
                        className="mask mask-squircle object-cover w-full h-full" 
                        alt="" 
                      />
                    </div>
                    <div>
                      <div className="font-black text-sm text-base-content leading-tight group-hover:text-secondary transition-colors">
                        {fav.title}
                      </div>
                      <div className="badge badge-ghost badge-xs mt-1 font-bold text-[9px] opacity-60 uppercase rounded-md border-none px-0 tracking-tighter">
                        {fav.category}
                      </div>
                    </div>
                  </div>
                </td>

                {/* TONE */}
                <td className="p-6 text-center">
                  <div className="inline-flex items-center px-4 py-1.5 bg-base-200/50 text-base-content/60 rounded-full text-[9px] font-black uppercase tracking-widest border border-base-300">
                    {fav.tone}
                  </div>
                </td>

                {/* SAVED DATE */}
                <td className="p-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-base-content/60">
                    <Calendar size={14} className="opacity-40" />
                    {new Date(fav.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </td>

                {/* STICKY ACTIONS */}
                <td className=" z-20 bg-base-100 group-hover:bg-base-200/50 transition-colors p-6 border-l border-base-300/50">
                  <div className="flex justify-center gap-3">
                    <Link 
                      to={`/lesson-details/${fav.lessonId}`} 
                      className="btn btn-square btn-ghost btn-sm hover:bg-secondary/10 hover:text-secondary rounded-xl transition-all"
                      title="View Details"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(fav.lessonId)} 
                      className="btn btn-square btn-ghost btn-sm hover:bg-error/10 hover:text-error rounded-xl transition-all"
                      title="Remove Favorite"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-32 text-center">
                <div className="flex flex-col items-center gap-4 opacity-10">
                  <Heart size={64} />
                  <p className="font-black uppercase tracking-[0.5em] text-sm">Your sanctuary is empty</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>
  );
};

export default MyFavorites;