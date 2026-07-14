import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { 
  Shield, 
  Trash2, 
  Search, 
  Users, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Mail,
  BookOpen
} from "lucide-react";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import ActionBtn from "../../../component/shared/ActionBtn";
import Loading from "../../../component/shared/Loading";

export default function ManageUsers() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const limit = 8;

  // Debounce search effect to save API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, debouncedSearch],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/users", {
        params: { page, limit, searchText: debouncedSearch },
      });
      return res.data;
    },
  });

  const users = data?.users || [];
  const totalPages = data?.totalPages || 1;

  const updateRole = async (id, role) => {
    Swal.fire({
      title: `Change role to ${role}?`,
      text: "This will modify administrative permissions.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "var(--p)",
      confirmButtonText: "Yes, Update",
      background: "var(--b1)",
      color: "var(--bc)",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.patch(`/admin/users/${id}/role`, { role });
        if (res.data.success) {
          toast.success(`Role updated to ${role}`);
          queryClient.invalidateQueries(["admin-users"]);
        }
      }
    });
  };

  const deleteUser = async (id, email) => {
    Swal.fire({
      title: "Permanent Removal?",
      text: `Deleting user: ${email}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "Yes, Delete User",
      background: "var(--b1)",
      color: "var(--bc)",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/admin/users/${id}`, { data: { email } });
        if (res.data.success) {
          toast.success("User permanently removed");
          queryClient.invalidateQueries(["admin-users"]);
        }
      }
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div className="p-4 md:p-8 space-y-6 animate-in fade-in duration-500 bg-base-100">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black italic tracking-tighter flex items-center gap-3">
            <Users className="text-primary w-8 h-8" /> Manage <span className="text-primary">Users</span>
          </h2>
          <p className="text-xs font-bold opacity-50 uppercase tracking-widest mt-1">
            Administrative Control Panel
          </p>
        </div>

        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-30 group-focus-within:opacity-100 transition-opacity" />
          <input
            placeholder="Search name or email..."
            className="input input-bordered w-full pl-11 rounded-2xl bg-base-200/50 border-base-300 focus:input-primary transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Sticky Table Wrapper */}
      <div className="bg-base-100 border border-base-300 rounded-[2rem] overflow-hidden shadow-sm">
        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="table-auto w-full min-w-max border-collapse">
            <thead className="bg-base-200/80">
              <tr className="text-left text-base-content/50 uppercase text-[10px] font-black tracking-widest">
                <th className="sticky left-0 z-20 bg-base-200 p-5 border-b border-base-300">User Identity</th>
                <th className="p-5 border-b border-base-300">Access Role</th>
                <th className="p-5 border-b border-base-300 text-center">Lessons</th>
                <th className="sticky right-0 z-20 bg-base-200 p-5 border-b border-base-300 text-center">Management</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-base-300">
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="p-20 text-center opacity-30 font-black uppercase tracking-widest">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users.map((user, i) => (
                  <tr key={user._id || i} className="hover:bg-base-200/30 transition-colors group">
                    {/* Sticky Identity Column */}
                    <td className="sticky w-3 left-0 z-10 bg-base-100 group-hover:bg-base-200/50 p-5 border-r border-base-300/50 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.05)]">
                      <div className="flex items-center gap-4">
                        <div className="avatar placeholder">
                          <div className="bg-primary/10 text-primary font-black rounded-xl w-10">
                            <span>{user?.name?.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="font-bold text-sm text-base-content leading-tight">
                            {user?.name}
                          </div>
                          <div className="text-[10px] opacity-50 font-medium flex items-center gap-1 mt-1">
                            <Mail size={10} /> {user?.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-5">
                      <div className={`badge badge-sm font-black gap-1 py-3 px-3 rounded-lg ${
                        user.role === 'admin' ? 'badge-secondary' : 'bg-base-200 border-none'
                      }`}>
                        <Shield size={10} />
                        {user.role?.toUpperCase()}
                      </div>
                    </td>

                    <td className="p-5 text-center">
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-base-200 rounded-full text-xs font-bold">
                        <BookOpen size={12} className="text-primary" />
                        {user?.totalLessons || 0}
                      </div>
                    </td>

                    {/* Sticky Actions Column */}
                    <td className=" z-10 bg-base-100 group-hover:bg-base-200/50 p-5 border-l border-base-300/50">
                      <div className="flex justify-center gap-3">
                        {user.role === "admin" ? (
                          <button
                            onClick={() => updateRole(user._id, "user")}
                            className="btn btn-xs btn-outline btn-warning rounded-lg gap-1 border-2"
                            title="Demote to User"
                          >
                            <ArrowDownCircle size={14} /> Demote
                          </button>
                        ) : (
                          <button
                            onClick={() => updateRole(user._id, "admin")}
                            className="btn btn-xs btn-outline btn-primary rounded-lg gap-1 border-2"
                            title="Promote to Admin"
                          >
                            <ArrowUpCircle size={14} /> Make Admin
                          </button>
                        )}
                        <button 
                          onClick={() => deleteUser(user._id, user.email)}
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

      {/* Pagination Container */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4">
        <span className="text-xs font-bold opacity-40 uppercase tracking-widest">
          Page {page} of {totalPages}
        </span>
        <div className="flex gap-2">
          {[...Array(totalPages).keys()].map((i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`btn btn-sm btn-square rounded-xl transition-all ${
                page === i + 1 ? "btn-primary shadow-lg shadow-primary/30" : "btn-ghost bg-base-200/50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}