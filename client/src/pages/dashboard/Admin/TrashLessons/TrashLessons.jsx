import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, RotateCcw, Inbox, ShieldAlert } from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";

export default function TrashLessons() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(8);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["admin-trash-lessons", page, limit],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/lessons/trash", {
        params: { page, limit },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const lessons = data?.lessons ?? [];
  const totalPages = data?.totalPages ?? 1;
  const totalLessons = data?.totalLessons ?? 0;

  const restoreMutation = useMutation({
    mutationFn: async (lessonId) => {
      const res = await axiosSecure.patch(`/admin/lessons/restore/${lessonId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["admin-lessons"]);
      queryClient.invalidateQueries(["admin-trash-lessons"]);
      toast.success(data?.message || "Lesson restored successfully");
    },
    onError: () => {
      toast.error("Failed to restore lesson");
    },
  });

  const purgeMutation = useMutation({
    mutationFn: async (lessonId) => {
      const res = await axiosSecure.delete(`/admin/report/delete/${lessonId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["admin-lessons"]);
      queryClient.invalidateQueries(["admin-trash-lessons"]);
      toast.success(data?.message || "Lesson permanently deleted");
    },
    onError: () => {
      toast.error("Failed to permanently delete lesson");
    },
  });

  const handleRestore = (lessonId) => {
    restoreMutation.mutate(lessonId);
  };

  const handlePermanentDelete = (lessonId) => {
    Swal.fire({
      title: "Permanently delete this lesson?",
      text: "This action cannot be undone and will purge all related data.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, permanently delete",
      customClass: {
        popup: "rounded-[2rem]",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        purgeMutation.mutate(lessonId);
      }
    });
  };

  return (
    <div className="space-y-6 p-2 md:p-6 bg-base-100 min-h-screen">
      <div className="rounded-4xl border border-base-300 bg-base-100 shadow-sm shadow-base-300/20 p-5 md:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-base-300 bg-base-200/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-base-content/70">
              <Inbox size={14} /> Trash Bin
            </div>
            <h2 className="text-gradient text-3xl md:text-4xl font-black italic tracking-tighter">
              Soft-Deleted Lessons
            </h2>
            <p className="max-w-2xl text-sm text-base-content/70">
              Review inactive lessons, restore them when needed, or permanently
              remove them from the platform.
            </p>
          </div>

          <div className="rounded-3xl border border-base-300 bg-base-200/50 px-4 py-3 text-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-base-content/60">
              Total In Trash
            </p>
            <p className="text-2xl font-black text-base-content">
              {totalLessons}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-4xl border border-base-300 bg-base-100 shadow-sm shadow-base-300/20 p-4 md:p-6">
        {isLoading ? (
          <div className="rounded-3xl border border-base-300 bg-base-200/40 p-8 text-center text-sm text-base-content/70">
            Loading trash items...
          </div>
        ) : lessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-base-300 bg-base-200/30 px-6 py-16 text-center">
            <div className="rounded-full bg-base-300/60 p-4 text-base-content/70">
              <Inbox size={28} />
            </div>
            <h3 className="mt-4 text-lg font-black text-base-content">
              Trash is empty
            </h3>
            <p className="mt-2 max-w-md text-sm text-base-content/70">
              Soft-deleted lessons will appear here for review and recovery.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="table table-zebra w-full min-w-195 rounded-3xl text-sm">
                <thead>
                  <tr className="bg-base-200 text-base-content/80">
                    <th className="rounded-tl-2xl">Lesson Title</th>
                    <th>Author Info</th>
                    <th>Deleted By</th>
                    <th>Date Deleted</th>
                    <th className="rounded-tr-2xl text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {lessons.map((lesson) => (
                    <tr key={lesson._id} className="align-middle">
                      <td>
                        <div className="space-y-1">
                          <p className="font-black text-base-content">
                            {lesson.title}
                          </p>
                          <p className="text-xs text-base-content/60">
                            {lesson.category || "Uncategorized"}
                          </p>
                        </div>
                      </td>
                      <td>
                        <div className="space-y-1">
                          <p className="font-semibold text-base-content">
                            {lesson.authorName || "Unknown"}
                          </p>
                          <p className="text-xs text-base-content/60">
                            {lesson.authorEmail || "—"}
                          </p>
                        </div>
                      </td>
                      <td>
                        <span className="rounded-full bg-base-200 px-3 py-1 text-xs font-semibold text-base-content/80">
                          {lesson.deletedBy || "—"}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm text-base-content/70">
                          {lesson.deletedAt
                            ? new Date(lesson.deletedAt).toLocaleString()
                            : "—"}
                        </span>
                      </td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleRestore(lesson._id)}
                            disabled={restoreMutation.isPending}
                            className="btn btn-sm rounded-full border border-base-300 bg-base-100 text-base-content hover:bg-success hover:text-success-content"
                            title="Restore lesson"
                          >
                            <RotateCcw size={16} />
                          </button>

                          <button
                            onClick={() => handlePermanentDelete(lesson._id)}
                            disabled={purgeMutation.isPending}
                            className="btn btn-sm rounded-full border border-error/20 bg-error text-error-content hover:brightness-95"
                            title="Permanently delete lesson"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-4 border-t border-base-300 pt-4 md:flex-row md:items-center md:justify-between">
              <p className="text-sm text-base-content/70">
                Showing page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1 || isFetching}
                  className="btn btn-sm rounded-full"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  disabled={page >= totalPages || isFetching}
                  className="btn btn-sm rounded-full"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
