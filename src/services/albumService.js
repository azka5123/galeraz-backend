const { prisma } = require("../models/prisma");
const customError = require("../utils/customError");

function handleErrorResponse(error, message) {
  throw new customError(500, `${message}: ${error.message}`);
}

async function getAllAlbums() {
  try {
    const albums = await prisma.album.findMany({
      include: { user: true },
    });

    return {
      status: "success",
      message: "Albums fetched successfully",
      data: albums,
    };
  } catch (error) {
    handleErrorResponse(error, "Error fetching albums");
  }
}

async function getAllAlbumsByUserId(id) {
    try {
      const albums = await prisma.album.findMany({where:{userId:id},
        include: { user: true },
      });
  
      return {
        status: "success",
        message: "Albums fetched successfully",
        data: albums,
      };
    } catch (error) {
      handleErrorResponse(error, "Error fetching albums");
    }
  }

async function getAlbum(idAlbum) {
  try {
    const album = await prisma.album.findFirst({
      where: { id: idAlbum },
      include: { user: true },
    });
    if (!album) {
      throw new customError(404, "Album not found");
    }
    return {
      status: "success",
      message: "Album fetched successfully",
      data: album,
    };
  } catch (error) {
    handleErrorResponse(error, "Error fetching album");
  }
}

async function createAlbum(userId, name, description) {
  const user = await prisma.user.findFirst({ where: { id: userId } });
  if (!user) {
    throw new customError(404, "User not found");
  }
  try {
    await prisma.album.create({
        data:{
            name,
            description,
            userId
        }
    })
    return{
        status: "success",
        message: "Album created successfully",
    }
  } catch (error) {
    handleErrorResponse(error, "Error creating album");
  }
}

async function updateAlbum(id, name, description) {
  try {
    await prisma.album.update({
      where: { id },
      data: {
        name,
        description,
      },
    })
    return{
        status: "success",
        message: "Album updated successfully",
    }
  }catch(error) {
    handleErrorResponse(error, "Error creating album");
  }
}

async function deleteAlbum(id){
    try{
        const posts = await prisma.post.findMany({ where: { albumId: id } });
  
        if (posts.length > 0) {
          for (const post of posts) {
            await prisma.post.update({
              where: {
                id: post.id
              },
              data: {
                albumId: null
              }
            });
          }
        }
        await prisma.album.delete({where:{id}})
        return{
            status: "success",
            message: "Album deleted successfully",
        }
    }catch(error){
        handleErrorResponse(error, "Error deleting album");
    }
}


module.exports = { getAllAlbums,getAllAlbumsByUserId,getAlbum, createAlbum, updateAlbum, deleteAlbum };
