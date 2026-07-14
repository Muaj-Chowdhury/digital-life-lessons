import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { BookOpen, Star, TrendingUp, Clock } from "lucide-react";
import useAuth from "../../hooks/useAuth";
import Loading from "../shared/Loading";

const StatCard = ({ icon: Icon, label, value, description }) => (
  <div className="bg-base-100 border border-base-300 rounded-[2rem] p-6 shadow-xl shadow-base-300/20 group hover:border-primary/50 transition-all duration-300">
    <div className="flex items-center gap-5">
      <div className="p-4 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-500">
        <Icon size={28} />
      </div>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-base-content/40 mb-1">{label}</p>
        <p className="text-3xl font-black italic tracking-tighter text-base-content leading-none">{value}</p>
      </div>
    </div>
  </div>
);

export default function UserStatistics() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data, isLoading } = useQuery({
    queryKey: ["dashboardOverview", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/dashboard/overview?email=${user.email}`);
      return res.data;
    },
    enabled: !!user?.email
  });

  if (isLoading) return <Loading />;

  const { stats, recentLessons, finalChartData } = data;

  return (
    <div className="p-4 bg-base-100 max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest mb-4">
            <TrendingUp size={14} /> Performance Analytics
          </div>
          <h1 className="text-4xl font-black italic tracking-tighter text-base-content">
            Your <span className="text-primary">Impact</span>
          </h1>
        </div>
        <p className="text-sm font-bold opacity-40 uppercase tracking-tighter flex items-center gap-2">
          <Clock size={16} /> Last Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {/* ===== Stats Grid ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <StatCard
          icon={BookOpen}
          label="Total Lessons"
          value={stats.totalLessons}
        />
        <StatCard
          icon={Star}
          label="Saved Wisdom"
          value={stats.totalFavorites}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* ===== Chart: Main Panel ===== */}
        <div className="lg:col-span-2 bg-base-100 border border-base-300 rounded-[2.5rem] shadow-2xl shadow-base-300/10 p-8">
          <h2 className="text-xl font-black italic tracking-tighter text-base-content mb-8">
            Creation <span className="text-primary text-sm uppercase not-italic tracking-widest ml-2 opacity-40">Activity (7D)</span>
          </h2>

         <div className="h-[300px] w-full">
  <ResponsiveContainer width="100%" height="100%">
    <LineChart data={finalChartData}>
      {/* 1. Grid: Using a fixed light color with low opacity for the dark theme */}
      <CartesianGrid 
        strokeDasharray="3 3" 
        vertical={false} 
        stroke="#ffffff" 
        opacity={0.1} 
      />
      
      {/* 2. XAxis: Ensure labels are bright enough to see */}
      <XAxis 
        dataKey="date" 
        axisLine={false} 
        tickLine={false} 
        tick={{ fill: "#9ca3af", fontSize: 10, fontWeight: 900 }}
        dy={10}
      />
      
      <YAxis hide domain={[0, 'auto']} />

      <Tooltip 
        contentStyle={{
          backgroundColor: "#1f2937", // Matches a dark base-200
          borderRadius: "16px",
          border: "1px solid #374151",
          color: "#ffffff"
        }}
        itemStyle={{ color: "#ffffff", fontWeight: "bold" }}
      />

      {/* 3. The Line: Using a vivid hex code so it definitely shows up */}
      <Line
        type="monotone"
        dataKey="count"
        stroke="#6366f1" // Indigo-500 (Vivid against dark)
        strokeWidth={4}
        dot={{ r: 6, fill: "#6366f1", strokeWidth: 2, stroke: "#0f172a" }} // stroke matches your dark bg
        activeDot={{ r: 8, strokeWidth: 0 }}
        animationDuration={1500}
      />
    </LineChart>
  </ResponsiveContainer>
</div>
        </div>

        {/* ===== Recent Lessons: Sidebar Panel ===== */}
        <div className="bg-base-200/50 border border-base-300 rounded-[2.5rem] p-8">
          <h2 className="text-xl font-black italic tracking-tighter text-base-content mb-6">
            Recent <span className="text-primary">Journal</span>
          </h2>

          <div className="space-y-4">
            {recentLessons.map((lesson, idx) => (
              <div
                key={lesson._id}
                className="group flex flex-col p-4 bg-base-100 border border-base-300 rounded-2xl hover:bg-primary hover:border-primary transition-all duration-300 cursor-default"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-sm leading-tight group-hover:text-primary-content transition-colors">
                    {lesson.title}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-40 group-hover:text-primary-content group-hover:opacity-80">
                    {new Date(lesson.createdAt).toLocaleDateString()}
                  </span>
                  <span className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md bg-base-200 text-base-content/60 group-hover:bg-primary-content group-hover:text-primary">
                    {lesson.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}