import { useQuery } from "@tanstack/react-query";
import { Users, BookOpen, Flag, Sparkles, Crown, ArrowUpRight } from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import LessonGrowthChart from "./LessonGrowthChart";
import UserGrowthChart from "./UserGrowthChart";
import Loading from "../../../../component/shared/Loading";

export default function AdminDashboard() {
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/dashboard/overview");
      return res.data;
    }
  });

  if (isLoading) return <Loading />;

  const { stats, lessonGrowth, userGrowth, topContributors } = data || {};

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      
      {/* ---------- HEADER ---------- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black italic tracking-tighter text-base-content">
            System <span className="text-primary text-2xl not-italic uppercase tracking-[0.2em] opacity-50 ml-2">Overview</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mt-1">Real-time platform metrics and growth analytics</p>
        </div>
        <div className="badge badge-outline border-base-300 p-4 font-black text-[10px] uppercase tracking-widest gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span> Live System Status
        </div>
      </div>

      {/* ---------- STATS GRID ---------- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Users"
          value={stats?.totalUsers}
          theme="primary"
        />
        <StatCard
          icon={BookOpen}
          label="Public Lessons"
          value={stats?.totalLessons}
          theme="accent"
        />
        <StatCard
          icon={Flag}
          label="Reported Content"
          value={stats?.reportedLessons}
          theme="error"
        />
        <StatCard
          icon={Sparkles}
          label="Today’s Velocity"
          value={stats?.todayLessons}
          theme="warning"
        />
      </div>

      {/* ---------- CHARTS SECTION ---------- */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-base-100 border border-base-300 rounded-[2.5rem] p-8 shadow-xl shadow-base-300/10">
           <h3 className="text-sm font-black uppercase tracking-widest opacity-40 mb-6">Lesson Trajectory</h3>
           <LessonGrowthChart data={lessonGrowth} />
        </div>
        <div className="bg-base-100 border border-base-300 rounded-[2.5rem] p-8 shadow-xl shadow-base-300/10">
           <h3 className="text-sm font-black uppercase tracking-widest opacity-40 mb-6">User Acquisition</h3>
           <UserGrowthChart data={userGrowth} />
        </div>
      </div>

      {/* ---------- TOP CONTRIBUTORS ---------- */}
      <div className="bg-neutral text-neutral-content rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black italic tracking-tighter flex items-center gap-3">
              <Crown className="text-warning" /> Leaderboard
            </h3>
            <button className="btn btn-ghost btn-xs font-black uppercase tracking-widest opacity-50">View All</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topContributors?.map((u, index) => (
              <div
                key={u.email}
                className="flex items-center justify-between p-5 rounded-[1.5rem] bg-base-100/5 border border-white/5 hover:bg-white/10 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="mask mask-squircle w-12 h-12 bg-neutral-focus flex items-center justify-center border border-white/10 shadow-inner">
                    <span className="font-black text-lg text-warning italic">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-black tracking-tight text-white group-hover:text-warning transition-colors">{u.name}</p>
                    <p className="text-[10px] font-bold opacity-40 uppercase tracking-tighter">{u.email}</p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-black italic tracking-tighter text-white">{u.lessons}</p>
                  <p className="text-[8px] font-black uppercase tracking-[0.2em] opacity-30">Lessons</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Background Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -mr-20 -mt-20"></div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, theme }) {
  // Mapping for safe DaisyUI semantic colors
  const themeClasses = {
    primary: "bg-primary/10 text-primary border-primary/20",
    accent: "bg-accent/10 text-accent border-accent/20",
    error: "bg-error/10 text-error border-error/20",
    warning: "bg-warning/10 text-warning border-warning/20",
  };

  return (
    <div className="bg-base-100 border border-base-300 rounded-[2rem] p-6 flex flex-col gap-4 shadow-sm hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${themeClasses[theme]} transition-transform group-hover:scale-110 duration-500`}>
        <Icon size={24} />
      </div>

      <div className="relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 mb-1">{label}</p>
        <h3 className="text-3xl font-black italic tracking-tighter text-base-content">{value || 0}</h3>
      </div>
      
      <ArrowUpRight className="absolute top-6 right-6 opacity-0 group-hover:opacity-20 transition-opacity" size={20} />
    </div>
  );
}