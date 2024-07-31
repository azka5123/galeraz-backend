const { prisma } = require("../models/prisma");
const customError = require('../utils/customError');
const fs = require('fs').promises; // Use fs.promises for async/await
const path = require('path');

// Helper function to delete a file
async function deleteFile(fileName) {
    const filePath = path.join(__dirname, `../public/images/${fileName}`);
    try {
        await fs.unlink(filePath);
    } catch (err) {
        throw new customError(500, `Error deleting file: ${err.message}`);
    }
}

async function getAllPosts() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                album: true,
                user: true,
            }
        });
        return {
            status: "success",
            message: "Posts fetched successfully",
            data: posts,
        };
    } catch (error) {
        throw new customError(500, `Error fetching posts: ${error.message}`);
    }
}

async function getPost(idPost) {
    try {
        const post = await prisma.post.findFirst({
            where: { id: idPost },
            include: {
                album: true,
                user: true,
            }
        });
        if(!post){
            throw new customError(404, `Post not found`);
        }
        return {
            status: "success",
            message: "Post fetched successfully",
            data: post,
        };
    } catch (error) {
        throw new customError(500, `Error fetching post: ${error.message}`);
    }
}

async function createPost(userId, title, albumId, description, imageFileName) {
    try {
        // console.log(userId);
        const user = await prisma.user.findFirst({where:{id:userId}})
        if(!user){
            throw new customError(404, `User not found`);
        }
        await prisma.post.create({
            data: {
                userId,
                title,
                albumId,
                description,
                image: imageFileName,
            },
        });
        return {
            status: "success",
            message: "Post created successfully",
        };
    } catch (error) {
        await deleteFile(imageFileName);
        throw new customError(500, `Error creating post: ${error.message}`);
    }
}

async function updatePost(id, title, albumId, description, imageFileName) {
    const post = await prisma.post.findFirst({ where: { id } });
    if (!post) {
        await deleteFile(imageFileName);
        throw new customError(404, `Post not found`);
    }

    const oldFilename = post.image;
    try {
        await prisma.post.update({
            where: { id },
            data: {
                title,
                albumId,
                description,
                image: imageFileName,
            },
        });
        if (oldFilename) {
            await deleteFile(oldFilename);
        }
        return {
            status: "success",
            message: "Post updated successfully",
        };
    } catch (error) {
        await deleteFile(imageFileName);
        throw new customError(500, `Error updating post: ${error.message}`);
    }
}

async function deletePost(id) {
    try {
        const post = await prisma.post.findFirst({ where: { id } });
        if (!post) {
            throw new customError(404, `Post not found`);
        }

        const filename = post.image;
        await prisma.post.delete({ where: { id } });
        if (filename) {
            await deleteFile(filename);
        }

        return {
            status: "success",
            message: "Post deleted successfully",
        };
    } catch (error) {
        throw new customError(500, `Error deleting post: ${error.message}`);
    }
}

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
};
