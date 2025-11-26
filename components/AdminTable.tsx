// components/AdminTable.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Loader2,
  BookOpen,
  Calendar,
  Crown,
  User as UserIcon,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import toast from "react-hot-toast";

interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  kajianCount: number;
}

export default function AdminTable() {
  const [adminList, setAdminList] = useState<AdminUser[]>([]);
  const [filteredList, setFilteredList] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    filterAdmins();
  }, [searchQuery, adminList]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");

      if (!res.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data = await res.json();
      setAdminList(data);
      setFilteredList(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  };

  const filterAdmins = () => {
    if (!searchQuery.trim()) {
      setFilteredList(adminList);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = adminList.filter(
      (admin) =>
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query)
    );
    setFilteredList(filtered);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <span className="ml-2 text-gray-600">Memuat data admin...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama atau email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Admin</p>
              <p className="text-3xl font-bold text-gray-900">
                {adminList.length}
              </p>
            </div>
            <Users className="w-12 h-12 text-emerald-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Super Admin</p>
              <p className="text-3xl font-bold text-gray-900">
                {adminList.filter((a) => a.role === "SUPER_ADMIN").length}
              </p>
            </div>
            <Crown className="w-12 h-12 text-yellow-500 opacity-20" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Kajian</p>
              <p className="text-3xl font-bold text-gray-900">
                {adminList.reduce((sum, admin) => sum + admin.kajianCount, 0)}
              </p>
            </div>
            <BookOpen className="w-12 h-12 text-blue-500 opacity-20" />
          </div>
        </div>
      </div>

      {/* Table */}
      {filteredList.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 text-lg">
            {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada admin"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Admin
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Tanggal Bergabung
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Jumlah Kajian
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredList.map((admin) => (
                  <tr
                    key={admin.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <UserIcon className="w-5 h-5 text-emerald-700" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {admin.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-700">{admin.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      {admin.role === "SUPER_ADMIN" ? (
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                          <Crown className="w-3 h-3" />
                          SUPER ADMIN
                        </span>
                      ) : (
                        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                          AUTHOR
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {format(new Date(admin.createdAt), "dd MMMM yyyy", {
                            locale: id,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <BookOpen className="w-4 h-4 text-emerald-600" />
                        <span className="font-semibold text-gray-900">
                          {admin.kajianCount}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden divide-y divide-gray-200">
            {filteredList.map((admin) => (
              <div key={admin.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">
                      {admin.name}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">{admin.email}</p>
                    {admin.role === "SUPER_ADMIN" ? (
                      <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        SUPER ADMIN
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                        AUTHOR
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(admin.createdAt), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <BookOpen className="w-4 h-4" />
                    {admin.kajianCount} Kajian
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
