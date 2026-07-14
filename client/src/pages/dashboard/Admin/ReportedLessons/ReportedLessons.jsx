import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { AlertTriangle, Trash2, Eye, Mail, ShieldAlert, X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import Loading from "../../../../component/shared/Loading";

export default function ReportedLessons() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selected, setSelected] = useState(null);

  const { data: lessons = [], isLoading } = useQuery({
    queryKey: ["reported-lessons"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/reported-lessons");
      return res.data;
    },
  });

  const deleteLesson = async (id) => {
    Swal.fire({
      title: "Permanent Deletion?",
      text: "This will remove the lesson and all associated reports.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete Lesson",
      background: "var(--b1)",
      color: "var(--bc)",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosSecure.delete(`/admin/report/delete/${id}`);
        queryClient.invalidateQueries(["reported-lessons"]);
        toast.success("Lesson removed permanently");
        setSelected(null);
      }
    });
  };

  const handleReportStatus = async (id, status) => {
    const isIgnore = status === "ignored";
    Swal.fire({
      title: isIgnore ? "Ignore Reports?" : "Mark as Reviewed?",
      text: isIgnore ? "These reports will no longer be flagged." : "Lesson will stay, reports will be archived.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: isIgnore ? "#6b7280" : "#22c55e",
      confirmButtonText: "Confirm Action",
      background: "var(--b1)",
      color: "var(--bc)",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.patch(`/admin/report/status/${id}`, { status: status });
        if (res.data.success) {
          queryClient.invalidateQueries(["reported-lessons"]);
          toast.success(`Reports ${status}`);
          setSelected(null);
        }
      }
    });
  };

  const openReportsModal = async (lesson) => {
    const res = await axiosSecure.get(`/admin/reports/${lesson._id}`);
    setSelected(res.data);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 bg-base-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-base-300 pb-6">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <ShieldAlert className="text-error w-8 h-8" /> Reported <span className="text-error">Lessons</span>
          </h2>
          <p className="text-[10px] font-black opacity-50 uppercase tracking-[0.2em] mt-1">
            Moderation Queue & Content Safety
          </p>
        </div>
        <div className="badge badge-error font-bold px-4 py-3 h-auto gap-2">
          {lessons.length} Issues Pending
        </div>
      </div>

      {/* Sticky Table Wrapper */}
      <div className="bg-base-100 border border-base-300 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="table-auto w-full min-w-max border-collapse">
            <thead className="bg-error/5">
              <tr className="text-left text-base-content/50 uppercase text-[10px] font-black tracking-widest">
                <th className="sticky left-0 z-20 bg-base-100 p-5 border-b border-base-300">Flagged Lesson</th>
                <th className="p-5 border-b border-base-300 text-center">Flags</th>
                <th className="p-5 border-b border-base-300">Author Contact</th>
                <th className="sticky right-0 z-20 bg-base-100 p-5 border-b border-base-300 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-base-300">
              {lessons.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center">
                    <div className="flex flex-col items-center gap-2 opacity-20">
                      <CheckCircle2 size={48} />
                      <p className="font-black uppercase tracking-widest text-sm">Clear Workspace: No Reports</p>
                    </div>
                  </td>
                </tr>
              ) : (
                lessons.map((lesson) => (
                  <tr key={lesson._id} className="hover:bg-error/5 transition-colors group">
                    {/* Sticky Lesson Info */}
                    <td className="sticky left-0 z-10 bg-base-100 group-hover:bg-base-200/50 p-5 border-r border-base-300/50 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="max-w-[250px]">
                        <div className="font-bold text-sm text-base-content leading-tight line-clamp-1">
                          {lesson.title}
                        </div>
                        <div className="text-[10px] text-error font-black uppercase mt-1 flex items-center gap-1">
                          <AlertTriangle size={10} /> Needs Review
                        </div>
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <span className="px-3 py-1 rounded-full bg-error/10 text-error text-xs font-black">
                        {lesson.reportCount} Reports
                      </span>
                    </td>

                    <td className="p-5">
                      <div className="flex items-center gap-2 text-xs font-bold opacity-60">
                        <Mail size={12} />
                        {lesson.authorEmail}
                      </div>
                    </td>

                    {/* Sticky Actions */}
                    <td className="sticky right-0 z-10 bg-base-100 group-hover:bg-base-200/50 p-5 border-l border-base-300/50">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => openReportsModal(lesson)}
                          className="btn btn-square btn-ghost btn-sm text-primary hover:bg-primary/10"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => deleteLesson(lesson._id)}
                          className="btn btn-square btn-ghost btn-sm text-error hover:bg-error/10"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reports Modal - Cleaned Up */}
      {selected && (
        <div className="fixed inset-0 bg-neutral-focus/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in zoom-in duration-200">
          <div className="bg-base-100 w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl flex flex-col max-h-[85vh] border border-base-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black italic tracking-tighter">
                Report <span className="text-error">Details</span>
              </h3>
              <button onClick={() => setSelected(null)} className="btn btn-ghost btn-circle btn-sm">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto pr-2 flex-1 custom-scrollbar">
              {selected.map((report, i) => (
                <div key={report._id || i} className="p-4 border border-base-300 rounded-2xl bg-base-200/30">
                  <p className="font-bold text-sm text-base-content italic">"{report.reason}"</p>
                  <div className="flex items-center justify-between mt-3 text-[10px] font-black uppercase opacity-40">
                    <span className="flex items-center gap-1"><Mail size={10}/> {report.reporterEmail}</span>
                    <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-base-300">
              <button
                onClick={() => handleReportStatus(selected[0]?.lessonId, "ignored")}
                className="btn btn-ghost bg-base-200 rounded-xl font-bold uppercase text-[10px]"
              >
                Ignore All
              </button>
              <button
                onClick={() => handleReportStatus(selected[0]?.lessonId, "reviewed")}
                className="btn btn-ghost bg-success/10 text-success hover:bg-success/20 rounded-xl font-bold uppercase text-[10px]"
              >
                Mark Reviewed
              </button>
              <button
                onClick={() => deleteLesson(selected[0]?.lessonId)}
                className="btn btn-error col-span-2 rounded-xl font-bold uppercase text-[10px] text-white"
              >
                Permanently Delete Lesson
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}