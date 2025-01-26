import { usersTable } from "@prisma-vs-drizzle/drizzle/src/db/schema";
import axios from "axios";
import "dotenv/config";
import { drizzle } from "drizzle-orm/postgres-js";
import { Pool } from "pg";

const AWS_SESSION_TOKEN = process.env["AWS_SESSION_TOKEN"] || "";

export const handler = async () => {
  const getParameterResponse = await axios.get(
    "http://localhost:2773/secretsmanager/get",
    {
      params: {
        secretId: process.env.SECRET_NAME,
      },
      headers: {
        "X-Aws-Parameters-Secrets-Token": AWS_SESSION_TOKEN,
      },
    }
  );

  const pool = new Pool({
    connectionString: `postgresql://postgres:${getParameterResponse.data.password}@${process.env.DATABASE_HOST}:5432/mydb?schema=public`,
  });

  const db = drizzle(pool);

  const users = await db
    .select()
    .from(usersTable)
    .finally(() => pool.end());

  return {
    statusCode: 200,
    users: users,
  };
};
