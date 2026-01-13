import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

interface TokenPayload {
  userId: number;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({
      error: "Não autenticado",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload;

    req.userId = decoded.userId;

    return next();
  } catch {
    return res.status(401).json({
      error: "Token inválido ou expirado",
    });
  }
}
