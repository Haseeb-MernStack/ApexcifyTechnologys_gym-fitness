import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRole } from "../models";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
}

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : undefined;

  if (!token) {
    return res.status(401).json({ message: "Missing auth token" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string; role: UserRole };
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

export function authorize(roles: UserRole[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
}
