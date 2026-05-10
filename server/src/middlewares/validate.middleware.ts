import type { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/apiError";

type Validator = (req: Request) => void | Promise<void>;

export const validate = (validator: Validator) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      await validator(req);
      next();
    } catch (error) {
      next(
        error instanceof ApiError
          ? error
          : new ApiError(400, "Validation failed"),
      );
    }
  };
};
