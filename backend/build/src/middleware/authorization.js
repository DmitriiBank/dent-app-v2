import { HttpError } from "../errorHandler/HttpError.js";
import { pool } from "../config/quizConfig.js";
async function checkPermission(route, roles) {
    const [rows] = await pool.query(`SELECT 1 FROM route_permissions WHERE route = ? AND role IN (?) LIMIT 1`, [route, roles]);
    return rows.length > 0;
}
export const authorize = (pathRoles) => {
    return async (req, res, next) => {
        try {
            const route = req.method + req.path;
            const role = req.user.role;
            if (pathRoles && pathRoles[route]) {
                const allowedRoles = pathRoles[route];
                const hasPermission = allowedRoles.includes(role);
                if (!hasPermission)
                    throw new HttpError(403, "Access denied");
            }
            else if (!(await checkPermission(route, role))) {
                throw new HttpError(403, "Access denied");
            }
            console.log("✅ Access granted:", req.user.name);
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
