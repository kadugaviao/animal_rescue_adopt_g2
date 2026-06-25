import { Request, Response, NextFunction } from "express";
import { adoptionService } from "../services/adoption.service";

export const adoptionController = {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const pedido = await adoptionService.create(req.user!.id, req.body);
      return res.status(201).json(pedido);
    } catch (err) {
      next(err);
    }
  },

  async listMine(req: Request, res: Response, next: NextFunction) {
    try {
      const pedidos = await adoptionService.listMine(req.user!.id);
      return res.status(200).json(pedidos);
    } catch (err) {
      next(err);
    }
  },

  async listAll(_req: Request, res: Response, next: NextFunction) {
    try {
      const pedidos = await adoptionService.listAll();
      return res.status(200).json(pedidos);
    } catch (err) {
      next(err);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const pedido = await adoptionService.updateStatus(String(req.params.id), req.body.status);
      return res.status(200).json(pedido);
    } catch (err) {
      next(err);
    }
  },
};
