const postService = require('../services/postService');
const customError = require('../utils/customError');
const path = require('path');

function validatePostData({ title, description }) {
  const errors = {};
  if (!title) errors.title = 'Title is required';
  if (!description) errors.description = 'Description is required';
  return errors;
}

// Helper function to get image file name from request
function getImageFileName(req) {
  if (req.file) {
      const imagePath = req.file.path;
      return path.basename(imagePath);
  }
  return null;
}


async function index(req, res) {
  // return res.json(req.user);
  try {
    const posts = await postService.getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    if (error instanceof customError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        error: error
      });
    }
  }
}

async function show(req,res){
  const id = req.params.id;

  try{
    const post = await postService.getPost(id);
    return res.status(200).json(post);
  }catch(error){
    if (error instanceof customError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        error: error
      });
    }
  }
}

async function store(req, res) {
  const { title, albumId, description } = req.body;
    const userId = req.user.userId;

    const errors = validatePostData({ title, description });
    if (Object.keys(errors).length > 0) {
        return res.status(400).json({
            status: 'error',
            message: 'All fields are required',
            missingField: errors,
        });
    }

    const imageFileName = getImageFileName(req);
    // if (!imageFileName) {
    //     return res.status(400).json({
    //         status: 'error',
    //         message: 'Image is required',
    //     });
    // }
    // const test = req.file;
    // return res.json({userId,title,albumId,description,imageFileName,test})
    try {
      // console.log(userId,title,albumId,description,imageFileName);
        const post = await postService.createPost(userId, title, albumId, description, imageFileName);
        return res.status(201).json(post);
    } catch (error) {
    if (error instanceof customError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        error: error

      });
    }
  }
}

async function update(req, res) {
  const id = req.params.id;
  const { title, albumId, description } = req.body;

  const errors = validatePostData({ title, description });
  if (Object.keys(errors).length > 0) {
      return res.status(400).json({
          status: 'error',
          message: 'All fields are required',
          missingField: errors,
      });
  }

  const imageFileName = getImageFileName(req);
  if (!imageFileName) {
      return res.status(400).json({
          status: 'error',
          message: 'Image is required',
      });
  }

  try {
      const post = await postService.updatePost(id, title, albumId, description, imageFileName);
      return res.status(200).json(post); // Changed to 200 for successful updates
  } catch (error) {
    if (error instanceof customError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        error: error
      });
    }
  }
}

async function destroy(req,res){
  const id = req.params.id;
  try{
   const post = await postService.deletePost(id);
   console.log("controller: "+ post);
   return res.status(200).json(post);
  }catch(error){
    if (error instanceof customError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
        error: error
      });
    }
  }
}

module.exports = {
  index,
  show,
  store,
  update,
  destroy
};
