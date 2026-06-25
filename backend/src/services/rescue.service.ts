import { RescueStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { CreateRescueDTO } from "../models/rescue.model";

const STATUS_VALIDOS: RescueStatus[] = ["OPEN", "RESCUED", "CANCELED"];

export const rescueService = {
  // Qualquer usuario logado registra um resgate.
  async create(userId: string, data: CreateRescueDTO) {
    return prisma.rescueReport.create({
      data: { userId, description: data.description, location: data.location },
    });
  },

  // Registros do proprio usuario logado.
  async listMine(userId: string) {
    return prisma.rescueReport.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  },

  // Todos os registros (apenas ADMIN).
  async listAll() {
    return prisma.rescueReport.findMany({
      include: { user: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: "desc" },
    });
  },

  // ADMIN altera o status do resgate.
  async updateStatus(id: string, status: RescueStatus) {
    if (!STATUS_VALIDOS.includes(status)) {
      throw new Error("Status invalido. Use OPEN, RESCUED ou CANCELED.");
    }
    return prisma.rescueReport.update({ where: { id }, data: { status } });
  },
};
