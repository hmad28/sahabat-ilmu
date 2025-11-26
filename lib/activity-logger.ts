// lib/activity-logger.ts

import { db } from "@/db";
import { activityLogs } from "@/db/schema";

type ActionType =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "LOGIN"
  | "LOGOUT"
  | "PROFILE_UPDATE";
type EntityType = "kajian" | "user" | "profile" | "auth";

interface LogActivityParams {
  userId: number;
  action: ActionType;
  entityType: EntityType;
  entityId?: number;
  description: string;
  metadata?: {
    changes?: Record<string, any>;
    oldValue?: any;
    newValue?: any;
    ip?: string;
    userAgent?: string;
    email?: string; // Added
    [key: string]: any; // Recommended for flexibility
  };
}


export async function logActivity(params: LogActivityParams) {
  try {
    await db.insert(activityLogs).values({
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId || null,
      description: params.description,
      metadata: params.metadata || null,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Jangan throw error agar tidak mengganggu proses utama
  }
}

// Helper untuk format changes
export function formatChanges(oldData: any, newData: any): Record<string, any> {
  const changes: Record<string, any> = {};

  const keys = new Set([
    ...Object.keys(oldData || {}),
    ...Object.keys(newData || {}),
  ]);

  keys.forEach((key) => {
    if (oldData?.[key] !== newData?.[key]) {
      changes[key] = {
        from: oldData?.[key],
        to: newData?.[key],
      };
    }
  });

  return changes;
}
