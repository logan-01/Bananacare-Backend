import { PrismaClient, Prisma } from "./generated/prisma";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "BananaCare 2025",
    email: "bananacare@gmail.com",
    password: "Bananacare_2025",
  },
];

export async function main() {
  for (const u of userData) {
    await prisma.user.create({ data: u });
  }
}

main();
