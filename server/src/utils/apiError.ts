export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  statusCode: number;
  errors?: FieldErrors;

  constructor(statusCode: number, message: string, errors?: FieldErrors) {
    super(message);
    this.statusCode = statusCode;
    this.name = "ApiError";
    if (errors) this.errors = errors;
  }
}
