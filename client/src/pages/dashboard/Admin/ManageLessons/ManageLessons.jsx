import { useState } from "react";
import { Star, Trash2, ShieldCheck, Flag, Layers, BadgeCheck, Search, Info } from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export default function ManageLessons() {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({
    status: "all",
    category: "all",
    visibility: "all",
  });

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["admin-lessons", filters],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/lessons", { params: filters });
      return res.data.lessons;
    },
    keepPreviousData: true,
  });

  const selectLesson = async (id) => {
    const res = await axiosSecure.get(`/admin/lessons/${id}`);
    setSelected(res.data);
  };

  const handleToggle = async (id, field, actionTakenBy) => {
    const res = await axiosSecure.patch(`/admin/lessons/${id}/toggle`, {
      field: field,
      actionTakenBy: actionTakenBy,
    });
    if (res.data.success) {
      queryClient.invalidateQueries(["admin-lessons"]);
      selectLesson(id);
      toast.success(`${field.replace('is', '')} status updated`);
    }
  };

  const handleDelete = (lessonId) => {
    Swal.fire({
      title: "Confirm Deletion",
      text: "This action is irreversible and will remove all associated data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "var(--er)",
      cancelButtonColor: "var(--n)",
      confirmButtonText: "Yes, Delete Permanentely",
      customClass: { popup: 'rounded-[2rem]' }
    }).then((result) => {
      if (result.isConfirmed) {
        axiosSecure.delete(`/lessons/${lessonId}`).then(() => {
          queryClient.invalidateQueries(["admin-lessons"]);
          setSelected(null);
          toast.success("Lesson purged from database");
        });
      }
    });
  };

  return (
    <div className="space-y-6 p-2 md:p-6 animate-in fade-in slide-in-from-bottom-4 bg-base-100 min-h-screen duration-700">
      
      {/* ---------- FILTER BAR ---------- */}
      <div className="bg-base-100 border border-base-300 rounded-[2rem] p-4 flex flex-wrap gap-6 items-center shadow-sm">
        <div className="flex bg-base-200 p-1 rounded-2xl">
          {[
            { key: "all", label: "All", icon: Search },
            { key: "reported", label: "Reported", icon: Flag },
            { key: "featured", label: "Featured", icon: Star },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setFilters((f) => ({ ...f, status: item.key }))}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all
              ${filters.status === item.key ? "bg-primary text-primary-content shadow-lg" : "hover:bg-base-300 text-base-content/50"}
            `}
            >
              <item.icon size={14} /> {item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-4 items-center ml-auto">
          <div className="flex items-center gap-2 w-full">
            
            <select
              value={filters.category}
              onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
              className="select select-sm  select-bordered bg-base-200 rounded-xl font-bold text-xs border-none"
            >
              <option value="all">Categories</option>
              <option value="Personal Growth">Personal Growth</option>
              <option value="Career">Career</option>
              <option value="Relationships">Relationships</option>
              <option value="Mindset">Mindset</option>
            </select>
          </div>

          <select
            value={filters.visibility}
            onChange={(e) => setFilters((f) => ({ ...f, visibility: e.target.value }))}
            className="select select-sm select-bordered bg-base-200 rounded-xl font-bold text-xs border-none"
          >
            <option value="all">Visibility</option>
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
        
        {/* ---------- LEFT: LIST PANEL ---------- */}
        <div className="lg:col-span-4 bg-base-100 border border-base-300 rounded-[2.5rem] overflow-hidden flex flex-col shadow-xl shadow-base-300/20">
          <div className="p-6 bg-base-200/50 border-b border-base-300 flex justify-between items-center">
            <h3 className="font-black italic tracking-tighter text-xl text-base-content">Inbox <span className="text-primary">Queue</span></h3>
            <div className="badge badge-neutral font-black text-[10px] tracking-tighter uppercase">{lessons.length} Lessons</div>
          </div>
          
          <div className="overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {lessons.map((lesson) => (
              <button
                key={lesson._id}
                onClick={() => selectLesson(lesson._id)}
                className={`w-full text-left p-4 rounded-3xl border transition-all duration-300 group
                ${selected?._id === lesson._id 
                  ? "bg-primary text-primary-content border-primary shadow-xl scale-[1.02]" 
                  : "bg-base-100 border-base-300 hover:border-primary/50 hover:bg-base-200"}
              `}
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className={`font-bold text-sm line-clamp-1 ${selected?._id === lesson._id ? "text-white" : "text-base-content"}`}>
                      {lesson.title}
                    </h4>
                    <p className={`text-[10px] font-black uppercase tracking-widest opacity-50`}>
                      By {lesson.authorName}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {lesson.featured && <Star size={12} className="fill-warning text-warning" />}
                    {lesson.reportCount > 0 && <Flag size={12} className="fill-error text-error" />}
                  </div>
                </div>
              </button>
            ))}
            {lessons.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full opacity-20 py-20">
                <Search size={48} />
                <p className="font-black uppercase tracking-widest text-xs mt-4">Queue Empty</p>
              </div>
            )}
          </div>
        </div>

        {/* ---------- RIGHT: REVIEW PANEL ---------- */}
        <div className="lg:col-span-8 bg-base-100 border border-base-300 rounded-[2.5rem] shadow-xl shadow-base-300/20 overflow-hidden flex flex-col relative">
          {!selected ? (
            <div className="flex-1 flex flex-col items-center justify-center opacity-30">
              <div className="w-20 h-20 bg-base-200 rounded-full flex items-center justify-center mb-4">
                <Info size={32} />
              </div>
              <p className="font-black uppercase tracking-[0.2em] text-xs italic">Select a lesson to begin review</p>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto p-8 md:p-12 space-y-10">
              
              <div className="flex justify-between items-start border-b border-base-300 pb-8">
                <div className="space-y-3">
                  <div className="badge badge-outline border-base-300 text-[10px] font-black uppercase tracking-widest">{selected.category}</div>
                  <h2 className="text-4xl font-black italic tracking-tighter text-base-content leading-none">{selected.title}</h2>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="w-6 mask mask-squircle">
                        <img src={selected.authorImage} />
                      </div>
                    </div>
                    <p className="text-sm font-bold opacity-60">Published by <span className="text-base-content underline underline-offset-4">{selected.authorName}</span></p>
                  </div>
                </div>
                <div className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest ${selected.visibility === 'public' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                  {selected.visibility}
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-base-content/80 font-medium leading-relaxed">
                {selected.description}
              </div>

              <div className="divider"></div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => handleToggle(selected._id, "isReviewed", "reviewedBy")}
                  className={`btn rounded-2xl px-6 h-14 font-black uppercase text-[10px] tracking-widest flex-1 gap-2 border-none
                    ${selected.isReviewed ? "bg-success text-success-content hover:bg-success/90" : "bg-base-200 text-base-content hover:bg-base-300"}
                  `}
                >
                  <BadgeCheck size={18} fill={selected.isReviewed ? "currentColor" : "none"} />
                  {selected.isReviewed ? "Verified Reviewed" : "Mark as Reviewed"}
                </button>

                <button
                  onClick={() => handleToggle(selected._id, "isFeatured")}
                  className={`btn rounded-2xl px-6 h-14 font-black uppercase text-[10px] tracking-widest flex-1 gap-2 border-none
                    ${selected.isFeatured ? "bg-warning text-warning-content hover:bg-warning/90" : "bg-base-200 text-base-content hover:bg-base-300"}
                  `}
                >
                  <Star size={18} fill={selected.isFeatured ? "currentColor" : "none"} />
                  {selected.isFeatured ? "Featured Wisdom" : "Feature on Homepage"}
                </button>

                <button 
                  onClick={() => handleDelete(selected._id)} 
                  className="btn btn-error btn-square h-14 w-14 rounded-2xl text-white shadow-xl shadow-error/20"
                >
                  <Trash2 size={20} />
                </button>
              </div>

              {/* REPORT LOGS */}
              {selected.reports?.length > 0 && (
                <div className="bg-error/5 rounded-3xl p-8 border border-error/10 mt-10">
                  <h3 className="font-black text-xs uppercase tracking-[0.2em] text-error flex items-center gap-2 mb-6">
                    <Flag size={14} /> Incident Reports ({selected.reports.length})
                  </h3>
                  <div className="grid gap-4">
                    {selected.reports.map((r, i) => (
                      <div key={i} className="bg-base-100 p-4 rounded-2xl border border-error/5 flex justify-between items-center">
                        <p className="text-sm font-bold italic tracking-tight">"{r.reason}"</p>
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-tighter">{r.reporterEmail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}