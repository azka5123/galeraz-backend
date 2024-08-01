const { prisma } = require("../models/prisma");
const customError = require('../utils/customError');
const { put, del } = require('@vercel/blob');

// Helper function for error handling
function handleErrorResponse(error, message) {
    throw new customError(500, `${message}: ${error.message}`);
}

// Helper function to delete a file
async function deleteFile(fileName) {
    const filePath = `../public/images/${fileName}`;
    try {
        await fs.unlink(filePath);
    } catch (err) {
        handleErrorResponse(err, 'Error deleting file');
    }
}

async function getAllPosts() {
    try {
        const posts = await prisma.post.findMany({
            include: { album: true, user: true },
        });
        return {
            status: "success",
            message: "Posts fetched successfully",
            data: posts,
        };
    } catch (error) {
        handleErrorResponse(error, 'Error fetching posts');
    }
}

async function getPost(idPost) {
    try {
        const post = await prisma.post.findFirst({
            where: { id: idPost },
            include: { album: true, user: true },
        });
        if (!post) {
            throw new customError(404, 'Post not found');
        }
        return {
            status: "success",
            message: "Post fetched successfully",
            data: post,
        };
    } catch (error) {
        handleErrorResponse(error, 'Error fetching post');
    }
}

async function createPost(userId, title, albumId, description, blob) {
    try {
        const resBlob = await put(blob[0].name, blob[0].data, { access: "public" });
        const user = await prisma.user.findFirst({ where: { id: userId } });
        if (!user) {
            throw new customError(404, 'User not found');
        }
        await prisma.post.create({
            data: {
                userId,
                title,
                albumId,
                description,
                image: resBlob.pathname,
                imageUrl: resBlob.url,
            },
        });
        return {
            status: "success",
            message: "Post created successfully",
        };
    } catch (error) {
        handleErrorResponse(error, 'Error creating post');
    }
}

async function updatePost(id, title, albumId, description, blob) {
    try {
        const post = await prisma.post.findFirst({ where: { id } });
        if (!post) {
            throw new customError(404, 'Post not found');
        }

        const resBlob = await put(blob[0].name, blob[0].data, { access: "public" });
        const oldFilename = post.imageUrl;

        await prisma.post.update({
            where: { id },
            data: {
                title,
                albumId,
                description,
                image: resBlob.pathname,
                imageUrl: resBlob.url,
            },
        });

        if (oldFilename) {
            await del(oldFilename);
        }

        return {
            status: "success",
            message: "Post updated successfully",
        };
    } catch (error) {
        handleErrorResponse(error, 'Error updating post');
    }
}

async function deletePost(id) {
    try {
        const post = await prisma.post.findFirst({ where: { id } });
        if (!post) {
            throw new customError(404, 'Post not found');
        }

        const filename = post.imageUrl;
        await prisma.post.delete({ where: { id } });
        
        if (filename) {
            await del(filename);
        }

        return {
            status: "success",
            message: "Post deleted successfully",
        };
    } catch (error) {
        handleErrorResponse(error, 'Error deleting post');
    }
}

module.exports = {
    getAllPosts,
    getPost,
    createPost,
    updatePost,
    deletePost
};
