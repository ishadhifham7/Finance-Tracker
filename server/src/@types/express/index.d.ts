import type { IUser } from "../../modules/auth/auth.model";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
