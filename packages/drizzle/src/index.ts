import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";

const DATABASE_URL = process.env.DATABASE_URL!;
const db = drizzle(DATABASE_URL);
