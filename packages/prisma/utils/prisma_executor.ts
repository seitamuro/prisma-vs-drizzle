import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

export const executor = async (callback: () => Promise<void>) => {
  try {
    await callback();
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
};
