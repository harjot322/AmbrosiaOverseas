import { getDb } from "@/lib/db-service"
import type { Session } from "next-auth"

type AuditInput = {
  session: Session
  request: Request
  action: string
  resource: string
  resourceId?: string
  details?: Record<string, unknown>
}

export const logAdminAction = async ({ session, request, action, resource, resourceId, details }: AuditInput) => {
  const db = await getDb()
  const forwardedFor = request.headers.get("x-forwarded-for") || ""
  const ip = forwardedFor.split(",")[0]?.trim() || "unknown"

  await db.collection("audit_logs").insertOne({
    action,
    resource,
    resourceId,
    userId: session.user?.id || null,
    userEmail: session.user?.email || null,
    method: request.method,
    path: new URL(request.url).pathname,
    ip,
    userAgent: request.headers.get("user-agent") || "",
    details: details || {},
    createdAt: new Date(),
  })
}
