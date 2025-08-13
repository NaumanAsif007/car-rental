import { processCarReturn } from "../returnCar";
import prisma from "@/lib/prisma";

// Mock dependencies
jest.mock("@/lib/prisma", () => ({
  rental: { findUnique: jest.fn(), update: jest.fn() },
  car: { update: jest.fn() },
  $transaction: jest.fn((cb) => cb(prisma)),
}));
jest.mock("@/lib/notifications", () => ({
  notifyCustomer: jest.fn(),
}));
jest.mock("@/lib/auth", () => ({
  getCurrentUser: jest.fn().mockResolvedValue({ id: "u1", role: "admin" }),
  hasPermission: jest.fn().mockReturnValue(true),
}));

describe("processCarReturn", () => {
  it("should return success when rental is processed", async () => {
    (prisma.rental.findUnique as jest.Mock).mockResolvedValue({
      id: "r1",
      carId: "c1",
      status: "Active",
      customerEmail: "test@example.com",
      Car: {},
    });

    const result = await processCarReturn({
      rentalId: "550e8400-e29b",
      odometerEnd: 1000,
    });

    expect(result.success).toBe(true);
  });

  it("should fail if outstanding balance exists", async () => {
    (prisma.rental.findUnique as jest.Mock).mockResolvedValue({
      id: "r1",
      carId: "c1",
      status: "Active",
      customerEmail: "test@example.com",
      Car: {},
    });

    const result = await processCarReturn({
      rentalId: "550e8400-e29b",
      odometerEnd: 1000,
      outstandingBalance: 50,
    });

    expect(result.success).toBe(false);
    expect(result.message).toContain("Outstanding balance");
  });
});
