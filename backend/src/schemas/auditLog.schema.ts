import mongoose, { Schema } from "mongoose";

const auditLogSchema = new Schema(
    {
        actor: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        actorRole: {
            type: String,
            required: true,
            trim: true,
        },
        action: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        entityType: {
            type: String,
            required: true,
            trim: true,
            index: true,
        },
        entityId: {
            type: String,
            trim: true,
        },
        details: {
            type: Schema.Types.Mixed,
            default: {},
        },
    },
    {
        timestamps: true,
    }
);

auditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model("AuditLog", auditLogSchema);
