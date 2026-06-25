import { Request, Response, NextFunction } from "express";

// Checa a presenca dos campos obrigatorios no req.body (400 se faltar algum).
export function validate(campos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const faltando = campos.filter(
      (c) => req.body[c] === undefined || req.body[c] === null || req.body[c] === ""
    );

    if (faltando.length > 0) {
      return res.status(400).json({
        message: `Campos obrigatorios faltando: ${faltando.join(", ")}.`,
      });
    }

    next();
  };
}
