import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { usersTable } from "./src/db/schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const db = drizzle(pool);

async function main() {
  const users = await db
    .select()
    .from(usersTable)
    .finally(() => pool.end());
  console.log(users);
}

main();
