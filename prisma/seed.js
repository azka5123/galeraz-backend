const {prisma} = require(".././src/models/prisma");
const clearDatabase = async () => {
  try {
    // Clear data from each model explicitly
    await prisma.post.deleteMany({});
    await prisma.token.deleteMany({});
    await prisma.album.deleteMany({});
    await prisma.user.deleteMany({});

    console.log('All collections have been cleared.');
  } catch (error) {
    console.error('Error clearing database:', error);
  } finally {
    await prisma.$disconnect();
  }
};

clearDatabase();