import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

// Controller faz a ponte HTTP <-> service. Erros vao pro errorMiddleware via next(err).

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.register(req.body);
      return res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.login(req.body);
      // null = email/senha nao batem. Mensagem generica de proposito.
      if (!result) {
        return res.status(401).json({ message: "Credenciais invalidas." });
      }
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.me(req.user!.id);
      if (!result) {
        return res.status(404).json({ message: "Usuario nao encontrado." });
      }
      return res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};
