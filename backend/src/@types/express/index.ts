import type { Express } from "express";

declare global {
  namespace Express {
    interface Request {
      auth: {
        id: number;
        name: string;
        email: string;
      };
    }
  }
}
