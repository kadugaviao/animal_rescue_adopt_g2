import { RescueStatus } from "@prisma/client";

export interface CreateRescueDTO {
  description: string;
  location: string;
}

export interface UpdateRescueStatusDTO {
  status: RescueStatus; // OPEN | RESCUED | CANCELED
}
