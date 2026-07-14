import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sparkles, Image as ImageIcon, Globe, Lock, Crown, Send } from "lucide-react";

import useAuth from "../../../hooks/useAuth";
import { imageUpload } from "../../../../utils";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const categories = ["Personal Growth", "Career", "Relationships", "Mindset", "Mistakes Learned"];
const emotionalTones = ["Motivational", "Sad", "Realization", "Gratitude"];

const AddLesson = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: isPremium } = useQuery({
    queryKey: ["user-access", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data.isPremium;
    },
    enabled: !!user?.email,
  });

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const selectedImage = watch("image");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      let imageUrl = "";
      if (selectedImage && selectedImage.length > 0) {
        imageUrl = await imageUpload(selectedImage[0]);
      }

      const lessonData = {
        ...data,
        image: imageUrl,
        authorEmail: user?.email,
        authorName: user?.displayName,
        authorImage: user?.photoURL,
        comments: [],
        likes: 0,
        createdAt: new Date(),
      };

      const res = await axiosSecure.post("/lessons", lessonData);
      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Lesson Published!",
          text: "Your wisdom has been shared with the world.",
          confirmButtonColor: "var(--p)", // Uses your primary theme color
          customClass: { popup: 'rounded-3xl' }
        });
        reset();
      }
    } catch (err) {
      Swal.fire("Error", "Failed to publish lesson. Try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
   <div className="min-h-screen bg-base-100 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
  {/* Page Header Section */}
  <div className="max-w-4xl mx-auto mb-10">
    <div className="flex flex-col items-center md:items-start">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-primary/20">
        <Sparkles size={14} className="animate-pulse" /> Creator Studio
      </div>
      
      <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-base-content leading-none">
        Share Your <span className="text-primary">Wisdom</span>
      </h1>
      
      <div className="flex items-center gap-3 mt-4">
        <span className="w-12 h-[2px] bg-primary/30"></span>
        <p className="text-sm font-bold opacity-40 uppercase tracking-widest">
          Content Creation Portal
        </p>
      </div>
      
      <p className="text-base-content/60 mt-6 font-medium max-w-xl text-center md:text-left leading-relaxed">
        Every lesson you share helps someone else navigate their journey. 
        Fill in the details below to publish your insight to the community.
      </p>
    </div>
  </div>

  {/* Form Card with Premium Styling */}
  <div className="max-w-4xl mx-auto bg-base-100 border border-base-300 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden relative">
    {/* Subtle Background Glow */}
    <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
    
    <form onSubmit={handleSubmit(onSubmit)} className="p-8 md:p-12 space-y-10 relative z-10">
      
      {/* Section 1: Main Content */}
      <div className="space-y-8">
        <div className="form-control">
          <label className="label py-0 mb-2">
            <span className="label-text font-black text-[10px] uppercase tracking-[0.2em] text-base-content/40">
              Lesson Title
            </span>
          </label>
          <input
            type="text"
            className={`input input-bordered h-14 w-full bg-base-200/40 rounded-2xl focus:input-primary border-base-300 font-bold text-lg transition-all ${errors.title ? "input-error" : ""}`}
            placeholder="e.g. Failure is a powerful teacher"
            {...register("title", { required: "A title is required" })}
          />
          {errors.title && <span className="text-error text-[10px] font-black uppercase mt-2 ml-2 tracking-tighter">{errors.title.message}</span>}
        </div>

        <div className="form-control">
          <label className="label py-0 mb-2">
            <span className="label-text font-black text-[10px] uppercase tracking-[0.2em] text-base-content/40">
              Full Narrative
            </span>
          </label>
          <textarea
            rows="6"
            className={`textarea textarea-bordered w-full bg-base-200/40 rounded-2xl focus:textarea-primary border-base-300 transition-all text-base leading-relaxed p-5 ${errors.description ? "textarea-error" : ""}`}
            placeholder="Tell the story behind this lesson..."
            {...register("description", { required: "Description is required" })}
          />
          {errors.description && <span className="text-error text-[10px] font-black uppercase mt-2 ml-2 tracking-tighter">{errors.description.message}</span>}
        </div>
      </div>

      <div className="divider opacity-30 text-[10px] font-black uppercase tracking-[0.4em]">Contextual Metadata</div>

      {/* Section 2: Metadata Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="form-control">
          <label className="label py-0 mb-2 font-black text-[10px] uppercase tracking-[0.2em] text-base-content/40">Category</label>
          <select className="select select-bordered h-12 bg-base-200/40 rounded-xl border-base-300 font-bold focus:border-primary" {...register("category", { required: true })}>
            <option value="">Select category</option>
            {categories.map((cat) => <option key={cat}>{cat}</option>)}
          </select>
        </div>

        <div className="form-control">
          <label className="label py-0 mb-2 font-black text-[10px] uppercase tracking-[0.2em] text-base-content/40">Emotional Tone</label>
          <select className="select select-bordered h-12 bg-base-200/40 rounded-xl border-base-300 font-bold focus:border-primary" {...register("tone", { required: true })}>
            <option value="">Select tone</option>
            {emotionalTones.map((tone) => <option key={tone}>{tone}</option>)}
          </select>
        </div>

        <div className="form-control">
          <label className="label py-0 mb-2 font-black text-[10px] uppercase tracking-[0.2em] text-base-content/40 flex items-center gap-2">
            <Globe size={12}/> Visibility
          </label>
          <select className="select select-bordered h-12 bg-base-200/40 rounded-xl border-base-300 font-bold" {...register("visibility")}>
            <option value="public">Public (Everyone can see)</option>
            <option value="private">Private (Only me)</option>
          </select>
        </div>

        <div className={`form-control ${!isPremium ? "tooltip tooltip-secondary" : ""}`} data-tip={!isPremium ? "Premium feature" : ""}>
          <label className="label py-0 mb-2 font-black text-[10px] uppercase tracking-[0.2em] text-base-content/40 flex items-center gap-2">
            <Crown size={12} className={isPremium ? "text-warning" : ""}/> Access Level
          </label>
          <select 
            className={`select select-bordered h-12 bg-base-200/40 rounded-xl border-base-300 font-bold ${!isPremium ? "opacity-50" : ""}`} 
            {...register("accessLevel")} 
            disabled={!isPremium} 
            defaultValue="free"
          >
            <option value="free">Free Access</option>
            <option value="premium">Premium Only Access</option>
          </select>
        </div>
      </div>

      {/* Section 3: Featured Visual */}
      <div className="form-control">
        <label className="label py-0 mb-3 font-black text-[10px] uppercase tracking-[0.2em] text-base-content/40">Featured Visual</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-base-300 rounded-[2rem] cursor-pointer bg-base-200/20 hover:bg-primary/5 hover:border-primary/50 transition-all duration-300">
            {selectedImage?.[0] ? (
               <div className="relative w-full h-full p-2">
                  <img src={URL.createObjectURL(selectedImage[0])} className="h-full w-full object-cover rounded-[1.8rem]" alt="Preview" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-[1.8rem]">
                    <p className="text-white font-black text-xs uppercase tracking-widest">Change Photo</p>
                  </div>
               </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <div className="p-4 bg-base-100 rounded-2xl shadow-sm mb-3">
                  <ImageIcon className="text-primary" size={24} />
                </div>
                <p className="text-[10px] text-base-content/40 font-black uppercase tracking-widest text-center px-4 leading-relaxed">
                  Recommended: High quality 16:9 image<br/>Click or Drag & Drop
                </p>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" {...register("image")} />
          </label>
        </div>
      </div>

      {/* Submit Action */}
      <div className="pt-4">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="btn btn-primary w-full rounded-2xl h-16 text-sm font-black uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95 border-none"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <div className="flex items-center gap-3">
               Publish Wisdom <Send size={18} />
            </div>
          )}
        </button>
      </div>
    </form>
  </div>
</div>
  );
};

export default AddLesson;