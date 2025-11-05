import bcrypt from "bcryptjs";
import { HttpError } from "../errorHandler/HttpError.js";
async function getBasicAuth(authHeader, service, req) {
    const BASIC = "Basic ";
    const auth = Buffer.from(authHeader.substring(BASIC.length), "base64").toString("ascii");
    const [id, password] = auth.split(":");
    const account = await service.getAccount(id);
    if (!account)
        throw new HttpError(401, "Account not found");
    const isMatch = await bcrypt.compare(password, account.password);
    if (!isMatch)
        throw new HttpError(401, "Invalid credentials");
    req.user.id = account._id;
    req.user.name = account.name;
    req.user.role = account.role;
    console.log("✅ AUTHENTICATED:", account.name);
}
export const authentication = (service) => {
    return async (req, res, next) => {
        try {
            const authHeader = req.header("Authorization");
            if (authHeader && authHeader.startsWith("Basic ")) {
                await getBasicAuth(authHeader, service, req);
            }
            next();
        }
        catch (err) {
            next(err);
        }
    };
};
export const skipRoutes = (skipRoutes) => {
    return (req, res, next) => {
        const route = req.method + req.path;
        if (!skipRoutes.includes(route) && !req.user._id) {
            throw new HttpError(401, "Unauthorized route");
        }
        next();
    };
};
