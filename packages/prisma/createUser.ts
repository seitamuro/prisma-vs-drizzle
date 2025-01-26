import * as yargs from "yargs";
import { executor, prisma } from "./utils/prisma_executor";

const argv = yargs
  .option("name", {
    description: "ユーザー名",
    demandOption: true,
  })
  .option("email", {
    description: "メールアドレス",
    demandOption: true,
  })
  .help()
  .parseSync();

async function main() {
  await prisma.user.create({
    data: {
      name: argv.name as string,
      email: argv.email as string,
      posts: {
        create: { title: "Hello World" },
      },
      profile: {
        create: { bio: "I like turtles" },
      },
    },
  });
}

executor(main);
