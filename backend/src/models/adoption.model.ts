import { AdoptionStatus } from "@prisma/client";

export interface CreateAdoptionDTO {
  animalId: string;
  message: string;
}

export interface UpdateAdoptionStatusDTO {
  status: AdoptionStatus; // APPROVED | REJECTED
}
