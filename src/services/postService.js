const { prisma } = require("../models/prisma");
const customError = require('../utils/customError');

async function getAllPosts() {
  try {
    const posts = await prisma.post.findMany();
    return {
      status: "success",
      message: "Posts fetched successfully",
      data: posts,
    };
  } catch (error) {
    throw new customError(500,`Error fetching posts: ${error.message}`);
  }
}

async function createPost(userId, title, albumId, description, imagePath) {
  if (!userId || !title || !description || !imagePath) {
    throw new customError(400, "All fields are required");
  }

  const checkUser = await prisma.user.findFirst({ where: { id: userId } });
  if (!checkUser) {
    throw new customError(404, "User not found");
  }

  try {
    const post = await prisma.post.create({
      data: {
        userId,
        title,
        albumId,
        description,
        image: imagePath,
      },
    });
    return {
      status: "success",
      message: "Post created successfully",
    };
  } catch (error) {
    throw new customError(500, `Error creating post: ${error.message}`);
  }
}

module.exports = {
  getAllPosts,
  createPost,
};
