"use client";
import { useEffect, useState } from "react";
import { adminAPI } from "@/lib/api";
import { FiSearch, FiSlash, FiCheck } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "verified" | "unverified" | "blocked">("all");

  useEffect(() => {
    adminAPI.getUsers()
      .then((res) => setUsers(res.data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleBlock = async (id: string, isBlocked: boolean) => {
    try {
      await adminAPI.blockUser(id, isBlocked);
      setUsers((prev) => prev.map((u) => u._id === id ? { ...u, isBlocked } : u));
      toast.success(isBlocked ? "User blocked" : "User unblocked");
    } catch {
      toast.error("Action failed");
    }
  };

  const filtered = users.filter((u) => {
    const matchSearch = search === "" ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.includes(search);
    const matchFilter =
      filter === "all" ? true :
      filter === "verified" ? u.isVerified :
      filter === "unverified" ? !u.isVerified :
      filter === "blocked" ? u.isBlocked : true;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl text-charcoal">Users</h1>
          <p className="font-poppins text-xs text-gray-400 mt-0.5">{users.length} registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email or phone..."
            className="input-field pl-9 py-2.5 text-sm" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "verified", "unverified", "blocked"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`font-poppins text-xs px-4 py-2 rounded-full capitalize transition-colors ${filter === f ? "bg-sage text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/80">
              <tr>
                {["User", "Email", "Phone", "Verified", "Status", "Joined", "Actions"].map((h) => (
                  <th key={h} className="font-poppins text-[11px] text-gray-400 text-left px-5 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 font-poppins text-sm text-gray-400">Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 font-poppins text-sm text-gray-400">No users found</td></tr>
              ) : filtered.map((u) => (
                <tr key={u._id} className={`hover:bg-gray-50/50 transition-colors ${u.isBlocked ? "opacity-60" : ""}`}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-sage/20 text-sage flex items-center justify-center font-poppins text-sm font-semibold flex-shrink-0">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-poppins text-sm text-charcoal">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-poppins text-xs text-gray-500">{u.email}</td>
                  <td className="px-5 py-3 font-poppins text-xs text-gray-500">{u.phone || "—"}</td>
                  <td className="px-5 py-3">
                    <span className={`font-poppins text-[10px] px-2 py-1 rounded-full ${u.isVerified ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}>
                      {u.isVerified ? "Verified" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <span className={`font-poppins text-[10px] px-2 py-1 rounded-full ${u.isBlocked ? "bg-red-50 text-red-500" : "bg-gray-50 text-gray-500"}`}>
                      {u.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-poppins text-xs text-gray-400">
                    {new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleBlock(u._id, !u.isBlocked)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${u.isBlocked ? "bg-green-50 text-green-500 hover:bg-green-100" : "bg-red-50 text-red-400 hover:bg-red-100"}`}
                      title={u.isBlocked ? "Unblock user" : "Block user"}
                    >
                      {u.isBlocked ? <FiCheck size={14} /> : <FiSlash size={14} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
