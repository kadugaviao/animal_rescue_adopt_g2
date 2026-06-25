import { Request, Response, NextFunction } from "express";

export function authorize(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Nao autenticado." });
    }

    if (!rolesPermitidos.includes(req.user.role)) {
      return res.status(403).json({ message: "Acesso negado: permissao insuficiente." });
    }

    next();
  };
}
