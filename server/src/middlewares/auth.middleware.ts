import type { Response, NextFunction } from "express";
import { auth } from "../config/firebase";
import { AuthRequest } from "../modules/auth/auth.types";
import { findOrCreateUser } from "../modules/auth/auth.service";
import { ApiError } from "../utils/apiError";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(401, "Unauthorized: No token provided");
    }

    const token = authHeader.split(" ")[1];

    const decodedToken = await auth.verifyIdToken(token);
    const user = await findOrCreateUser(decodedToken);

    req.user = user;
    next();
  } catch (error) {
    next(
      error instanceof ApiError
        ? error
        : new ApiError(401, "Unauthorized: Invalid or expired token"),
    );
  }
};
