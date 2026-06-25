import { Request, Response, NextFunction } from "express";

// Loga toda request que entra: timestamp + metodo + url. Util para depuracao.
export function loggerMiddleware(req: Request, _res: Response, next: NextFunction) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}
