import { PrismaClient } from "@prisma/client";
const express = require("express");
const app = express();
const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log(users);
}

// Route Handler - Fix Here: Include both `req` and `res`
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend is working!" });
});

app.listen(3000, () => {
  console.log(`Example app listening on port 3000`);
});

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
