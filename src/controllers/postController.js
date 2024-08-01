const postService = require('../services/postService');
const customError = require('../utils/customError');

function validatePostData({ title, description }) {
  const errors = {};
  if (!title) errors.title = 'Title is required';
  if (!description) errors.description = 'Description is required';
  return errors;
}

function getImageData(req){
  const blobs = [];
    for (const fileKey of Object.keys(req.files)) {
      const file = req.files[fileKey];
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const fileExtension = file.name.split('.').pop(); // Extract file extension
      const filename = `${req.user.username}-${uniqueSuffix}.${fileExtension}`;
      blobs.push({
        name: filename,
        data: file.data,
      });
    }

    return blobs;
}

function handleValidationErrors(data) {
  const errors = validatePostData(data);
  if (Object.keys(errors).length > 0) {
    return {
      statusCode: 400,
      response: {
        status: 'error',
        message: 'All fields are required',
        missingField: errors,
      },
    };
  }
  return null;
}

// Centralized error handling
function handleErrorResponse(res, error) {
  if (error instanceof customError) {
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      error,
    });
  }
  return res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred',
    error,
  });
}


async function index(req, res) {
  // return res.json(req.user);
  try {
    const posts = await postService.getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    return handleErrorResponse(res, error);

  }
}

async function show(req,res){
  const id = req.params.id;

  try{
    const post = await postService.getPost(id);
    return res.status(200).json(post);
  }catch(error){
    return handleErrorResponse(res, error);
  }
}

async function store(req, res) {
  const { title, albumId, description } = req.body;
  const userId = req.user.userId;

  const validationError = handleValidationErrors({ title, description });
  if (validationError) {
    return res.status(validationError.statusCode).json(validationError.response);
  }

  const blobs = getImageData(req);

  try {
    const post = await postService.createPost(userId, title, albumId, description, blobs);
    return res.status(201).json(post);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

async function update(req, res) {
  const id = req.params.id;
  const { title, albumId, description } = req.body;

  const validationError = handleValidationErrors({ title, description });
  if (validationError) {
    return res.status(validationError.statusCode).json(validationError.response);
  }

  const blobs = getImageData(req);

  try {
    const post = await postService.updatePost(id, title, albumId, description, blobs);
    return res.status(200).json(post);
  } catch (error) {
    return handleErrorResponse(res, error);
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
