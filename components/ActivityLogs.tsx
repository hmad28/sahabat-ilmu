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
  CREATE: "bg-green-100 text-green-700 border-green-200",
  UPDATE: "bg-blue-100 text-blue-700 border-blue-200",
  DELETE: "bg-red-100 text-red-700 border-red-200",
  LOGIN: "bg-purple-100 text-purple-700 border-purple-200",
  LOGOUT: "bg-gray-100 text-gray-700 border-gray-200",
  PROFILE_UPDATE: "bg-yellow-100 text-yellow-700 border-yellow-200",
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
    return actionColors[action] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Activity Logs</h2>
              <p className="text-sm text-gray-500">
                Monitor semua aktivitas di sistem
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
              showFilters
                ? "bg-indigo-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border-t border-gray-200 pt-4 mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Action
                </label>
                <select
                  value={filters.action}
                  onChange={(e) => handleFilterChange("action", e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entity Type
                </label>
                <select
                  value={filters.entityType}
                  onChange={(e) =>
                    handleFilterChange("entityType", e.target.value)
                  }
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Semua Entity</option>
                  <option value="kajian">Kajian</option>
                  <option value="user">User</option>
                  <option value="profile">Profile</option>
                  <option value="auth">Auth</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari deskripsi..."
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    className="w-full border-2 border-gray-300 rounded-lg pl-10 pr-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) =>
                    handleFilterChange("startDate", e.target.value)
                  }
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) =>
                    handleFilterChange("endDate", e.target.value)
                  }
                  className="w-full border-2 border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <span className="ml-2 text-gray-600">Loading logs...</span>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">Tidak ada log</p>
            <p className="text-gray-500 text-sm mt-1">
              Belum ada aktivitas yang tercatat
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Action Badge */}
                  <div
                    className={`flex-shrink-0 w-10 h-10 rounded-lg border flex items-center justify-center ${getActionColor(
                      log.action
                    )}`}
                  >
                    {getActionIcon(log.action)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {log.description}
                        </p>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {log.user?.name || "Unknown User"}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {format(
                              new Date(log.createdAt),
                              "dd MMM yyyy, HH:mm",
                              { locale: id }
                            )}
                          </span>
                          {log.entityType && (
                            <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
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

                    {/* Metadata (if exists) */}
                    {log.metadata?.changes && (
                      <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-medium text-gray-700 mb-2">
                          Changes:
                        </p>
                        <div className="space-y-1">
                          {Object.entries(log.metadata.changes).map(
                            ([key, value]) => (
                              <div key={key} className="text-xs text-gray-600">
                                <span className="font-medium">{key}:</span>{" "}
                                <span className="text-red-600 line-through">
                                  {JSON.stringify(value.from)}
                                </span>{" "}
                                →{" "}
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

      {/* Pagination */}
      {!loading && logs.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Halaman {page} dari {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
