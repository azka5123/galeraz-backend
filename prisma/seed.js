const {prisma} = require(".././src/models/prisma");
async function main() {
  await prisma.token.deleteMany({});
  await prisma.user.deleteMany({});

//   const user = await prisma.user.create({
//     data: {
//       name: "azka",
//       username: "zzzz5123",
//       address: "padang",
//       email: "cobadulu769@gmail.com",
//       password: "123",
//     },
//   });

//   console.log({ user });
console.log('database deleted');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
