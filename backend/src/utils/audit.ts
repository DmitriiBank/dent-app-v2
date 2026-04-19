import { logger } from "../Logger/winston";
import { AuditLog } from "../schemas/auditLog.schema";
import { AuthRequest } from "./quizTypes";

type AuditPayload = {
    action: string;
    entityType: string;
    entityId?: string | null;
    details?: Record<string, unknown>;
};

export const writeAuditLog = async (req: AuthRequest, payload: AuditPayload) => {
    try {
        await AuditLog.create({
            actor: req.user._id,
            actorRole: req.user.role,
            action: payload.action,
            entityType: payload.entityType,
            entityId: payload.entityId ?? undefined,
            details: payload.details ?? {},
        });
    } catch (error) {
        logger.warn("Failed to persist audit log", {
            action: payload.action,
            entityType: payload.entityType,
            entityId: payload.entityId,
            error: error instanceof Error ? error.message : String(error),
        });
    }
};
