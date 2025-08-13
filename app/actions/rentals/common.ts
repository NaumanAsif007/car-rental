import { ReturnCarInput } from "./types";
import { z } from "zod";

export const returnCarSchema = z.object({
  rentalId: z.string().uuid(),
  odometerEnd: z.number().int().min(0),
  damageReport: z.string().optional(),
  damageImages: z.array(z.string().url()).optional(),
  outstandingBalance: z.number().min(0).optional(),
});

export function validateReturnCarInput(input: unknown): ReturnCarInput {
  const parsed = returnCarSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error("Invalid input data");
  }
  return parsed.data;
}
