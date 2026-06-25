import { AdoptionStatus } from "@prisma/client";
import prisma from "../lib/prisma";
import { CreateAdoptionDTO } from "../models/adoption.model";

export const adoptionService = {
  // Usuario logado solicita a adocao de um animal.
  async create(userId: string, data: CreateAdoptionDTO) {
    const animal = await prisma.animal.findUnique({ where: { id: data.animalId } });
    if (!animal) {
      throw new Error("Animal nao encontrado.");
    }
    // So aceita solicitacao quando o animal esta disponivel.
    if (animal.status !== "AVAILABLE") {
      throw new Error("Este animal nao esta disponivel para adocao.");
    }

    // Bloqueia pedido duplicado do mesmo usuario pro mesmo animal (409).
    const pedidoExistente = await prisma.adoptionRequest.findFirst({
      where: { userId, animalId: data.animalId },
    });
    if (pedidoExistente) {
      const erro = new Error("Voce ja solicitou a adocao deste animal.");
      (erro as { status?: number }).status = 409;
      throw erro;
    }

    return prisma.adoptionRequest.create({
      data: { userId, animalId: data.animalId, message: data.message },
    });
  },

  // Solicitacoes do proprio usuario logado.
  async listMine(userId: string) {
    return prisma.adoptionRequest.findMany({
      where: { userId },
      include: { animal: true },
      orderBy: { createdAt: "desc" },
    });
  },

  // Todas as solicitacoes (apenas ADMIN).
  async listAll() {
    return prisma.adoptionRequest.findMany({
      include: {
        animal: true,
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  // ADMIN aprova ou rejeita. Ao aprovar, o animal vira ADOPTED.
  // Os dois updates rodam na mesma transacao: ou os dois acontecem, ou nenhum.
  async updateStatus(id: string, status: AdoptionStatus) {
    if (status !== "APPROVED" && status !== "REJECTED") {
      throw new Error("Status invalido. Use APPROVED ou REJECTED.");
    }

    return prisma.$transaction(async (tx) => {
      const pedido = await tx.adoptionRequest.update({
        where: { id },
        data: { status },
      });

      if (status === "APPROVED") {
        await tx.animal.update({
          where: { id: pedido.animalId },
          data: { status: "ADOPTED" },
        });
      }

      return pedido;
    });
  },
};
