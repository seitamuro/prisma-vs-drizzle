import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { usersTable } from "./src/db/schema";
import yargs = require("yargs");

const argv = yargs
  .option("name", {
    description: "ユーザー名",
    demandOption: true,
  })
  .option("email", {
    description: "メールアドレス",
    demandOption: true,
  })
  .option("age", {
    description: "年齢",
    demandOption: true,
  })
  .help()
  .parseSync();

const db = drizzle(process.env.DATABASE_URL!);

async function main() {
  const user: typeof usersTable.$inferInsert = {
    name: argv.name as string,
    email: argv.email as string,
    age: parseInt(argv.age as string),
  };
  await db.insert(usersTable).values(user);
}

main();
