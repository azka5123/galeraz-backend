const { prisma } = require("../models/prisma");
const customError = require("../utils/customError");

function handleErrorResponse(error, message) {
  throw new customError(500, `${message}: ${error.message}`);
}

async function createLike(postId,userId, ) {
    const checkPost = await prisma.post.findFirst({
        where: {
            id: postId
        }
    })

    if(!checkPost) {
        throw new customError(404, "Invalid post ID");
    }
    try{
        await prisma.like.create({
            data:{
                userId,
                postId,
            }
        });
        return {
            status: "success",
            message: "Post liked successfully"
        }
    }catch(error){
        handleErrorResponse(error, "Error liked post");
    }
}

async function deleteLike(postId,userId, ) {
    // console.log(userId, postId);
    try{
        await prisma.like.deleteMany({
            where:{
                userId,
                postId
            }
        });
        return {
            status: "success",
            message: "Post unliked successfully"
        }
    }catch(error){
        handleErrorResponse(error, "Error unliked like");
    }
}

module.exports = {
  createLike,
  deleteLike,
};