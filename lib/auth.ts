import jwt from "jsonwebtoken";
import type { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET || "dev-only-change-me";

export interface TokenPayload {
  uid: number;
  email: string;
}

export function signToken(payload: TokenPayload) {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, SECRET) as TokenPayload;
  } catch {
    return null;
  }
}

export function getUserFromReq(req: NextRequest): TokenPayload | null {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  return token ? verifyToken(token) : null;
}
