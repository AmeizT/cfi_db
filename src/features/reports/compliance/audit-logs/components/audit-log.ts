export type AuditAction = "Created" | "Updated" | "Deleted"

export interface AuditLog {
  id: number;
  user: number;
  user_email: string;
  model: string;
  object_id: number;
  action: AuditAction;
  old_data: Record<string, unknown> | null;
  new_data: Record<string, unknown> | null;
  timestamp: string;
}
