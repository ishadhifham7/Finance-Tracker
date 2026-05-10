import { Response, NextFunction } from "express";
import { auth } from "../config/firebase";
import User from "../modules/auth/auth.model";
import { AuthRequest } from "../modules/auth/auth.types";

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 1. Verify the token with Firebase
    const decodedToken = await auth.verifyIdToken(token);
    const { uid, email, name, picture } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: "Invalid token: Email missing" });
    }

    // 2. The "Pro Move": Find or Create user in MongoDB (Lazy Sync)
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        email: email,
        displayName: name,
        photoURL: picture,
      });
    }

    // 3. Attach user to the request object
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
