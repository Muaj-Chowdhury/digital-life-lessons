import React, { useState } from "react";
import { FaCrown } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Calendar, BookOpen, Bookmark, Award, Edit3 } from "lucide-react";

import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import PublicLessonCard from "../../../component/card/PublicLessonCard";
import EditProfileModal from "../../../component/Modals/EditProfileModal";
import Loading from "../../../component/shared/Loading";

const Profile = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [openModal, setOpenModal] = useState(false);

  const { data: profile, isLoading, refetch } = useQuery({
    queryKey: ["profile", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/profile/${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const { data: lessons = [] } = useQuery({
    queryKey: ["myLessons", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/my-lessons?email=${user?.email}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-10 animate-in fade-in duration-500 bg-base-100">
      
      {/* --- Profile Header Card --- */}
      <div className="relative overflow-hidden bg-base-100 border border-base-300 shadow-xl rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8">
        {/* Profile Image with Ring */}
        <div className="relative">
          <img
            src={profile?.image || "https://via.placeholder.com/150"}
            className="w-32 h-32 rounded-3xl object-cover ring-4 ring-primary/10 shadow-lg"
            alt="Profile"
          />
          {profile?.isPremium && (
            <div className="absolute -top-3 -right-3 bg-warning text-warning-content p-2 rounded-xl shadow-lg border-2 border-base-100">
              <FaCrown size={18} />
            </div>
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-2">
          <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
            <h2 className="text-3xl font-black tracking-tight">{profile?.name}</h2>
            {profile?.isPremium && (
              <div className="badge badge-warning font-bold py-3 px-4 gap-2">
                PREMIUM MEMBER
              </div>
            )}
          </div>
          <p className="text-base-content/60 font-medium text-lg">{profile?.email}</p>
          
          <button 
            onClick={() => setOpenModal(true)} 
            className="btn btn-primary btn-sm rounded-xl mt-4 normal-case gap-2"
          >
            <Edit3 size={16} /> Edit Profile
          </button>
        </div>

        {/* Decorative background element */}
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* --- Stats Grid --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={<BookOpen className="text-primary" />} 
          label="Lessons Created" 
          value={profile?.lessonsCreated || 0} 
        />
        <StatCard 
          icon={<Bookmark className="text-secondary" />} 
          label="Saved Lessons" 
          value={profile?.lessonsSaved || 0} 
        />
        <StatCard 
          icon={<Award className="text-accent" />} 
          label="Account Plan" 
          value={profile?.isPremium ? "Premium" : "Free Tier"} 
        />
        <StatCard 
          icon={<Calendar className="text-info" />} 
          label="Member Since" 
          value={profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A"} 
        />
      </div>

      {/* --- Lessons List --- */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-base-300 pb-4">
          <h3 className="text-2xl font-black flex items-center gap-2">
             My Public Lessons
          </h3>
          <span className="badge badge-outline p-3 font-bold">{lessons.length} Total</span>
        </div>

        {lessons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map(lesson => (
              <PublicLessonCard 
                key={lesson._id} 
                lesson={lesson} 
                userIsPremium={profile?.isPremium} 
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-base-200/50 rounded-3xl border-2 border-dashed border-base-300">
            <p className="text-base-content/40 font-bold">You haven't created any lessons yet.</p>
          </div>
        )}
      </div>

      {/* --- Edit Modal --- */}
      {openModal && (
        <EditProfileModal
          user={user}
          profile={profile}
          refetch={refetch}
          onClose={() => setOpenModal(false)}
        />
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="bg-base-100 border border-base-300 rounded-3xl p-5 flex flex-col items-center text-center hover:shadow-lg transition-all duration-300 group">
    <div className="bg-base-200 p-3 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <p className="text-base-content/40 text-[10px] font-black uppercase tracking-widest">{label}</p>
    <p className="text-2xl font-black mt-1 text-base-content">{value}</p>
  </div>
);

export default Profile;