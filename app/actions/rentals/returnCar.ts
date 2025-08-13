"use server";

import prisma from "@/lib/prisma";
import { notifyCustomer } from "@/lib/notifications";
import { getCurrentUser, hasPermission } from "@/lib/auth";
import { validateReturnCarInput } from "./common";
import { ReturnCarResult } from "./types";

export async function processCarReturn(input: unknown): Promise<ReturnCarResult> {
  // Step 1: Validate
  const { rentalId, odometerEnd, damageReport, damageImages, outstandingBalance } =
    validateReturnCarInput(input);

  // Step 2: Auth
  const user = await getCurrentUser();
  if (!user || !hasPermission(user)) {
    throw new Error("Unauthorized");
  }

  // Step 3: Fetch Rental
  const rental = await prisma.rental.findUnique({
    where: { id: rentalId },
    include: { Car: true },
  });

  if (!rental) throw new Error("Rental not found");
  if (rental.status !== "Active") throw new Error("Rental is not active");

  // Step 4: Outstanding balance check
  if (outstandingBalance && outstandingBalance > 0) {
    return { success: false, message: `Outstanding balance: $${outstandingBalance}` };
  }

  // Step 5: Save damage images (mock)
  if (damageImages?.length) {
    console.log(`📷 Damage images for rental ${rentalId}:`, damageImages);
  }

  // Step 6: Transaction
  await prisma.$transaction(async (tx: any) => {
    await tx.rental.update({
      where: { id: rentalId },
      data: {
        returnedAt: new Date(),
        odometerEnd,
        damageReport,
        status: "Returned",
      },
    });

    await tx.car.update({
      where: { id: rental.carId },
      data: {
        odometer: odometerEnd,
        status: "Active",
      },
    });
  });

  // Step 7: Notify
  await notifyCustomer(rental.customerEmail, "Your rental has been processed.");

  return { success: true, message: "Car return processed successfully" };
}
