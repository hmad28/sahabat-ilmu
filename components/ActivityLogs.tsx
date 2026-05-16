"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  User,
  FileText,
  Trash2,
  Edit,
  LogIn,
  LogOut as LogOutIcon,
  Settings,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface ActivityLog {
  id: number;
  action: string;
  entityType: string;
  entityId: number | null;
  description: string;
  metadata: {
    changes?: Record<string, { from: unknown; to: unknown }>;
  } | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}
const actionIcons: Record<string, LucideIcon> = {
  CREATE: FileText,
  UPDATE: Edit,
  DELETE: Trash2,
  LOGIN: LogIn,
  LOGOUT: LogOutIcon,
  PROFILE_UPDATE: Settings,
};

const actionColors: Record<string, string> = {
  CREATE: "bg-emerald-100 text-emerald-800 border-emerald-200",
  UPDATE: "bg-amber-100 text-amber-900 border-amber-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
  LOGIN: "bg-emerald-50 text-emerald-800 border-emerald-200",
  LOGOUT: "bg-stone-100 text-stone-700 border-stone-200",
  PROFILE_UPDATE: "bg-amber-50 text-amber-900 border-amber-200",
};

export default function ActivityLogs() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    action: "",
    entityType: "",
    search: "",
    startDate: "",
    endDate: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...(filters.action && { action: filters.action }),
        ...(filters.entityType && { entityType: filters.entityType }),
        ...(filters.search && { search: filters.search }),
        ...(filters.startDate && { startDate: filters.startDate }),
        ...(filters.endDate && { endDate: filters.endDate }),
      });

      const res = await fetch(`/api/activity-logs?${params}`);
      if (!res.ok) throw new Error("Failed to fetch logs");

      const data = await res.json();
      setLogs(data.logs);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Fetch logs error:", error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPage(1); // Reset to first page on filter change
  };

  const resetFilters = () => {
    setFilters({
      action: "",
      entityType: "",
      search: "",
      startDate: "",
      endDate: "",
    });
    setPage(1);
  };

  const getActionIcon = (action: string) => {
    const Icon = actionIcons[action] || AlertCircle;
    return <Icon className="w-4 h-4" />;
  };

  const getActionColor = (action: string) => {
    return (
      actionColors[action] || "bg-stone-100 text-stone-700 border-stone-200"
    );
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm sm:p-5">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-900 text-amber-50">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-emerald-950">
                Log Aktivitas
              </h2>
              <p className="text-sm text-emerald-950/60">
                Monitor semua aktivitas di sistem
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition ${
              showFilters
                ? "bg-emerald-900 text-amber-50"
                : "border border-emerald-900/15 bg-white text-emerald-900 hover:bg-emerald-50"
            }`}
          >
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {showFilters && (
          <div className="mt-4 space-y-4 border-t border-emerald-900/10 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-950/75">
                  Action
                </label>
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange("action", e.target.value)}
                  className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                >
                  <option value="">Semua Action</option>
                  <option value="CREATE">Create</option>
                  <option value="UPDATE">Update</option>
                  <option value="DELETE">Delete</option>
                  <option value="LOGIN">Login</option>
                  <option value="LOGOUT">Logout</option>
                  <option value="PROFILE_UPDATE">Profile Update</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-950/75">
                  Entity Type
                </label>
                <select
                  value={filters.entityType}
                  onChange={(e) =>
                    handleFilterChange("entityType", e.target.value)
                  }
                  className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                >
                  <option value="">Semua Entity</option>
                  <option value="kajian">Kajian</option>
                  <option value="user">User</option>
                  <option value="profile">Profile</option>
                  <option value="auth">Auth</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-950/75">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-emerald-900/35" />
                  <input
                    type="text"
                    placeholder="Cari deskripsi..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="w-full rounded-md border border-emerald-900/15 bg-white py-2 pl-10 pr-3 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-950/75">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-emerald-950/75">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-sm text-emerald-950 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-700/15"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full rounded-md border border-emerald-900/15 bg-white px-4 py-2 text-sm font-semibold text-emerald-900 transition hover:bg-emerald-50"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg border border-emerald-900/10 bg-white/85 shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-7 w-7 animate-spin text-emerald-700" />
            <span className="ml-2 text-sm text-emerald-950/65">
              Loading logs...
            </span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="mx-auto mb-4 h-12 w-12 text-emerald-800/25" />
            <p className="text-lg font-semibold text-emerald-950">
              Tidak ada log
            </p>
            <p className="mt-1 text-sm text-emerald-950/60">
              Belum ada aktivitas yang tercatat
            </p>
          </div>
        ) : (
          <div className="divide-y divide-emerald-900/10">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 transition-colors hover:bg-emerald-50/55"
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md border ${getActionColor(
                      log.action
                    )}`}
                  >
                    {getActionIcon(log.action)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-emerald-950">
                          {log.description}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-emerald-950/60">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {log.user?.name || "Unknown User"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(
                              new Date(log.createdAt),
                              "dd MMM yyyy, HH:mm",
                              { locale: id }
                            )}
                          </span>
                          {log.entityType && (
                            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-xs text-emerald-800">
                              {log.entityType}
                            </span>
                          )}
                        </div>
                      </div>
                      <span
                        className={`flex-shrink-0 px-2 py-1 text-xs font-medium rounded border ${getActionColor(
                          log.action
                        )}`}
                      >
                        {log.action}
                      </span>
                    </div>

                    {log.metadata?.changes && (
                      <div className="mt-3 rounded-md border border-emerald-900/10 bg-[#fffaf0] p-3">
                        <p className="mb-2 text-xs font-semibold text-emerald-950/75">
                          Changes:
                        </p>
                        <div className="space-y-1">
                          {Object.entries(log.metadata.changes).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="text-xs text-emerald-950/65"
                              >
                                <span className="font-medium">{key}:</span>{" "}
                                <span className="text-red-600 line-through">
                                  {JSON.stringify(value.from)}
                                </span>{" "}
                                {"->"}{" "}
                                <span className="text-green-600">
                                  {JSON.stringify(value.to)}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {!loading && logs.length > 0 && (
        <div className="rounded-lg border border-emerald-900/10 bg-white/80 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm text-emerald-950/65">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="rounded-md border border-emerald-900/15 bg-white px-3 py-2 text-emerald-900 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
