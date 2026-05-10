import type { Request } from "express";
import type { IUser } from "./auth.model";

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface DecodedToken {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
}
