// components/AdminTable.tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const filteredList = useMemo(() => {
    if (!searchQuery.trim()) return adminList;

    const query = searchQuery.toLowerCase();
    return adminList.filter(
      (admin) =>
        admin.name.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query)
    );
  }, [adminList, searchQuery]);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");

      if (!res.ok) {
        throw new Error("Failed to fetch admins");
      }

      const data = await res.json();
      setAdminList(data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Gagal memuat data admin");
    } finally {
      setLoading(false);
    }
  };

  const superAdminCount = adminList.filter(
    (admin) => admin.role === "SUPER_ADMIN"
  ).length;
  const totalKajian = adminList.reduce(
    (sum, admin) => sum + admin.kajianCount,
    0
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
        <span className="ml-2 text-sm text-emerald-950/65">
          Memuat data admin...
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-emerald-950">
              Daftar Admin
            </h2>
            <p className="text-sm text-emerald-950/60">
              Lihat admin dan kontribusi kajian.
            </p>
          </div>
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/35" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-emerald-900/15 bg-white py-2.5 pl-9 pr-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/55">
                Total Admin
              </p>
              <p className="mt-2 text-3xl font-semibold text-emerald-950">
                {adminList.length}
              </p>
            </div>
            <Users className="h-10 w-10 text-emerald-800/20" />
          </div>
        </div>

        <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/55">
                Super Admin
              </p>
              <p className="mt-2 text-3xl font-semibold text-emerald-950">
                {superAdminCount}
              </p>
            </div>
            <Crown className="h-10 w-10 text-amber-600/30" />
          </div>
        </div>

        <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-900/55">
                Total Kajian
              </p>
              <p className="mt-2 text-3xl font-semibold text-emerald-950">
                {totalKajian}
              </p>
            </div>
            <BookOpen className="h-10 w-10 text-emerald-800/20" />
          </div>
        </div>
      </div>

      {filteredList.length === 0 ? (
        <div className="rounded-lg border border-emerald-900/10 bg-white/80 px-4 py-14 text-center shadow-sm">
          <Users className="mx-auto mb-4 h-12 w-12 text-emerald-800/25" />
          <p className="text-lg font-semibold text-emerald-950">
            {searchQuery ? "Tidak ada hasil pencarian" : "Belum ada admin"}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white/85 shadow-sm">
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-emerald-900/10 bg-emerald-50/70">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-emerald-900/60">
                    Admin
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-emerald-900/60">
                    Email
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-emerald-900/60">
                    Role
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] text-emerald-900/60">
                    Tanggal Bergabung
                  </th>
                  <th className="px-5 py-3 text-center text-xs font-bold uppercase tracking-[0.14em] text-emerald-900/60">
                    Jumlah Kajian
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-900/10">
                {filteredList.map((admin) => (
                  <tr
                    key={admin.id}
                    className="transition-colors hover:bg-emerald-50/55"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-100">
                          <UserIcon className="h-5 w-5 text-emerald-800" />
                        </div>
                        <div>
                          <p className="font-semibold text-emerald-950">
                            {admin.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-emerald-950/70">
                        {admin.email}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {admin.role === "SUPER_ADMIN" ? (
                        <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-900">
                          <Crown className="h-3 w-3" />
                          SUPER ADMIN
                        </span>
                      ) : (
                        <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-800">
                          AUTHOR
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 text-emerald-950/65">
                        <Calendar className="h-4 w-4" />
                        <span className="text-sm">
                          {format(new Date(admin.createdAt), "dd MMMM yyyy", {
                            locale: id,
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <BookOpen className="h-4 w-4 text-emerald-700" />
                        <span className="font-semibold text-emerald-950">
                          {admin.kajianCount}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="divide-y divide-emerald-900/10 md:hidden">
            {filteredList.map((admin) => (
              <div key={admin.id} className="p-4 transition hover:bg-emerald-50/55">
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-emerald-100">
                    <UserIcon className="h-6 w-6 text-emerald-800" />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 font-semibold text-emerald-950">
                      {admin.name}
                    </p>
                    <p className="mb-2 text-sm text-emerald-950/65">
                      {admin.email}
                    </p>
                    {admin.role === "SUPER_ADMIN" ? (
                      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">
                        <Crown className="h-3 w-3" />
                        SUPER ADMIN
                      </span>
                    ) : (
                      <span className="rounded-md bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">
                        AUTHOR
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-emerald-950/65">
                    <Calendar className="h-4 w-4" />
                    {format(new Date(admin.createdAt), "dd MMM yyyy", {
                      locale: id,
                    })}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-700 font-semibold">
                    <BookOpen className="h-4 w-4" />
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
