import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";

dotenv.config(); // 👈 this makes Prisma see DATABASE_URL from .env

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    seed: `ts-node prisma/seed.ts`,
  },
});
