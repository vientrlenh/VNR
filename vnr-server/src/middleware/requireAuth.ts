import type { Request, Response, NextFunction } from "express";
import { verifyToken, type JwtPayload } from "../lib/jwt.js";

export interface AuthedRequest extends Request {
    user?: JwtPayload
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    if (!token) {
        return res.status(401).send({ message: "Thiếu token" });
    }

    try {
        req.user = verifyToken(token);
        next();
    } catch {
        res.status(401).send({ message: "Token không hợp lệ" });
    }
}
