const { prisma } = require("../models/prisma");
const customError = require("../utils/customError");

function handleErrorResponse(error, message) {
  throw new customError(500, `${message}: ${error.message}`);
}

async function createComment(postId,userId, content) {
    console.log(postId);
    const checkPost = await prisma.post.findFirst({
        where: {
            id: postId
        }
    })

    if(!checkPost) {
        throw new customError(404, "Invalid post ID");
    }
    try{
        await prisma.comment.create({
            data:{
                userId,
                postId,
                content,
            }
        });
        return {
            status: "success",
            message: "Post commented successfully"
        }
    }catch(error){
        handleErrorResponse(error, "Error comment post");
    }
}

async function deleteComment( commentId,userId,) {
    const checkComment = await prisma.comment.findFirst({
        where: {
            id: commentId
        }
    })

    if(!checkComment) {
        throw new customError(404, "Invalid comment ID");
    }
    try{
        await prisma.comment.deleteMany({
            where:{
                id:checkComment.id,
                userId,
            }
        });
        return {
            status: "success",
            message: "Post uncommented successfully"
        }
    }catch(error){
        handleErrorResponse(error, "Error uncommentd comment");
    }
}

module.exports = {
    createComment,
    deleteComment,
};