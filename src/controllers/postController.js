const postService = require('../services/postService');
const customError = require('../utils/customError');

async function index(req, res) {
  try {
    const posts = await postService.getAllPosts();
    return res.status(200).json(posts);
  } catch (error) {
    if (error instanceof customError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
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
      });
    }
  }
}

async function store(req, res) {
  const { userId, title, albumId, description } = req.body;

  if (!userId || !title || !description) {
    return res.status(400).json({
      status: 'error',
      message: 'All fields are required',
      missingField: {
        userId: !userId ? 'User id is required' : undefined,
        title: !title ? 'Title is required' : undefined,
        description: !description ? 'Description is required' : undefined,
      },
    });
  }

  if (!req.file) {
    return res.status(400).json({
      status: 'error',
      message: 'Image is required',
    });
  }

  try {
    const imagePath = req.file.path;
    const post = await postService.createPost({userId, title, albumId, description, imagePath});
    return res.status(201).json(post);
  } catch (error) {
    if (error instanceof customError) {
      return res.status(error.statusCode).json({
        status: 'error',
        message: error.message,
      });
    }
  }
}

module.exports = {
  index,
  show,
  store,
};
