import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./src/db/schema";

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const users = await db.select().from(usersTable);
  console.log(users);
}

main();
