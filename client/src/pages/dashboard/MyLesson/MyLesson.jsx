import React, { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCrown, FaEdit } from "react-icons/fa";
import { AiOutlineUnlock, AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaTrashCan, FaHeart, FaStar } from "react-icons/fa6";
import ActionBtn from "../../../component/shared/ActionBtn";
import UpdateLessonModal from "../../../component/Modals/UpdateLessonModal";
import { toast } from "react-toastify";
import Loading from "../../../component/shared/Loading";

const MyLesson = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingLesson, setEditingLesson] = useState(null);

  const { data: lessons = [], isLoading, refetch } = useQuery({
    queryKey: ["myLessons", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-lessons?email=${user?.email}`);
      return res.data;
    },
  });

  const toggleAccessLevel = async (lesson) => {
    const newLevel = lesson.accessLevel === "premium" ? "free" : "premium";
    Swal.fire({
      title: "Change Access Level?",
      text: `Switching to ${newLevel.toUpperCase()}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--p)",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update it!",
      background: "var(--b1)",
      color: "var(--bc)",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.patch(`/lessons/updateInfo/${lesson._id}`, { accessLevel: newLevel });
        refetch();
        toast.success(`Access set to ${newLevel}`);
      }
    });
  };

  const toggleVisibility = async (lessonId, currentVisibility) => {
    const newVisibility = currentVisibility === "public" ? "private" : "public";
    try {
      const res = await axiosSecure.patch(`/lessons/updateInfo/${lessonId}`, { visibility: newVisibility });
      if (res.data.modifiedCount > 0) {
        refetch();
        toast.success(`Now ${newVisibility}`);
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async (lessonId) => {
    Swal.fire({
      title: "Delete Lesson?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Delete Permanently",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/lessons/${lessonId}`);
          if (res.data.success) {
            refetch();
            toast.success("Deleted successfully");
          }
        } catch {
          toast.error("Failed to delete");
        }
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="">
      <div className="min-h-screen bg-base-100 p-4 md:p-8 space-y-8 animate-in fade-in duration-700">
  
  {/* Glassmorphism Header Card */}
  <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-[2.5rem] border border-primary/10">
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="w-8 h-[2px] bg-primary"></span>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Creator Studio</span>
        </div>
        <h2 className="text-4xl font-black italic tracking-tighter text-base-content">
          My <span className="text-primary">Lessons</span>
        </h2>
        <p className="text-xs font-bold opacity-50 mt-2 max-w-xs leading-relaxed">
          Manage, analyze, and update your published wisdom from one central hub.
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="stats shadow-sm bg-base-100 border border-base-300 rounded-2xl">
          <div className="stat px-6 py-3">
            <div className="stat-title text-[10px] font-black uppercase">Total Content</div>
            <div className="stat-value text-primary text-2xl">{lessons.length}</div>
            <div className="stat-desc font-bold">Lessons Live</div>
          </div>
        </div>
      </div>
    </div>
    {/* Decorative Background Element */}
    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
  </div>

  {/* Main Table Section */}
  <div className="bg-base-100 border border-base-300 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
    <div className="overflow-x-auto w-full custom-scrollbar">
      <table className="table-auto w-full min-w-max border-collapse">
        <thead>
          <tr className="bg-base-200/50 text-base-content/40 uppercase text-[10px] font-black tracking-widest border-b border-base-300">
            <th className=" z-30 bg-base-200/90 backdrop-blur-md p-6 text-left">Content Identity</th>
            <th className="p-6 text-left">Engagement</th>
            <th className="p-6 text-left">Access Mode</th>
            <th className="p-6 text-left">Status</th>
            <th className="p-6 text-left">Published</th>
            <th className=" z-30 bg-base-200/90 backdrop-blur-md p-6 text-center">Control</th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-base-300/30">
          {lessons.map((lesson) => (
            <tr key={lesson._id} className="hover:bg-primary/[0.02] transition-all duration-300 group">
              
              {/* STICKY CONTENT IDENTITY */}
              <td className="z-20  bg-base-100 group-hover:bg-base-200/50 transition-colors p-6 border-r border-base-300/50 shadow-[10px_0_20px_-10px_rgba(0,0,0,0.04)]">
                <div className="flex items-center gap-4 sm:flex-row">
                  <div className="mask  mask-squircle w-14 h-14 bg-base-200 p-0.5 border border-base-300 group-hover:border-primary/50 transition-all">
                    <img src={lesson.image} className="mask mask-squircle object-cover w-full h-full" alt="" />
                  </div>
                  <div>
                    <div className="font-black text-sm text-base-content group-hover:text-primary transition-colors leading-tight">
                      {lesson.title}
                    </div>
                    <div className="badge badge-ghost badge-xs mt-1 font-bold text-[9px] opacity-60 uppercase rounded-md border-none px-0">
                      {lesson.category}
                    </div>
                  </div>
                </div>
              </td>

              {/* ENGAGEMENT STATS */}
              <td className="p-6">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-xs font-black">
                    <span className="text-error flex items-center gap-1.5 bg-error/5 px-2 py-1 rounded-lg">
                      <FaHeart size={10}/> {lesson.likes?.length || 0}
                    </span>
                    <span className="text-warning flex items-center gap-1.5 bg-warning/5 px-2 py-1 rounded-lg">
                      <FaStar size={10}/> {lesson.favoritesCount || 0}
                    </span>
                  </div>
                </div>
              </td>

              {/* ACCESS MODE */}
              <td className="p-6">
                <button
                  onClick={() => toggleAccessLevel(lesson)}
                  className={`btn btn-xs h-8 rounded-xl gap-2 font-black uppercase text-[10px] border shadow-sm transition-all active:scale-95 ${
                    lesson.accessLevel === "premium" 
                    ? "bg-warning/10 text-warning border-warning/20 hover:bg-warning hover:text-white" 
                    : "bg-base-200 text-base-content/40 border-base-300 hover:bg-base-300 hover:text-base-content"
                  }`}
                >
                  {lesson.accessLevel === "premium" ? <FaCrown size={12} /> : <AiOutlineUnlock size={12} />}
                  {lesson.accessLevel}
                </button>
              </td>

              {/* VISIBILITY TOGGLE */}
              <td className="p-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    className="toggle toggle-sm toggle-success"
                    checked={lesson.visibility === "public"}
                    onChange={() => toggleVisibility(lesson._id, lesson.visibility)}
                  />
                  <span className={`text-[10px] font-black uppercase tracking-tight ${lesson.visibility === 'public' ? 'text-success' : 'opacity-30'}`}>
                    {lesson.visibility}
                  </span>
                </div>
              </td>

              {/* DATE */}
              <td className="p-6">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-base-content/70">
                    {new Date(lesson.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-[10px] font-black opacity-30 uppercase">
                    {new Date(lesson.createdAt).getFullYear()}
                  </span>
                </div>
              </td>

              {/* STICKY CONTROL ACTIONS */}
              <td className=" z-20 bg-base-100 group-hover:bg-base-200/50 transition-colors p-6 border-l border-base-300/50">
                <div className="flex justify-center gap-2">
                  <button onClick={() => setEditingLesson(lesson)} className="btn btn-square btn-ghost btn-sm hover:bg-primary/10 hover:text-primary rounded-xl transition-all">
                    <FaEdit size={16} />
                  </button>
                  <button onClick={() => handleDelete(lesson._id)} className="btn btn-square btn-ghost btn-sm hover:bg-error/10 hover:text-error rounded-xl transition-all">
                    <FaTrashCan size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</div>

      {editingLesson && (
        <UpdateLessonModal
          lesson={editingLesson}
          onClose={() => setEditingLesson(null)}
          refetch={refetch}
        />
      )}
    </div>
  );
};

export default MyLesson;