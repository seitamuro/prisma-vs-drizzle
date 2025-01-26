import { prisma } from "@prisma-vs-drizzle/prisma";

export const handler = async () => {
  const users = await prisma.user.findMany();

  return {
    statusCode: 200,
    users: users,
  };
};
