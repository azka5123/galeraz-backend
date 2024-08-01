const albumService = require("../services/albumService");
const customError = require("../utils/customError");

function validatePostData({ name, description }) {
  const errors = {};
  if (!name) errors.name = "Title is required";
  if (!description) errors.description = "Description is required";
  return errors;
}

function handleValidationErrors(data) {
  const errors = validatePostData(data);
  if (Object.keys(errors).length > 0) {
    return {
      statusCode: 400,
      response: {
        status: "error",
        message: "All fields are required",
        missingField: errors,
      },
    };
  }
  return null;
}

function handleErrorResponse(res, error) {
  if (error instanceof customError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
      error,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "An unexpected error occurred",
    error,
  });
}

async function index(req, res) {
  try {
    const albums = await albumService.getAllAlbums();
    return res.status(200).json(albums);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

async function indexByUserId(req, res) {
  const userId = req.user.userId;
  try {
    const albums = await albumService.getAllAlbumsByUserId(userId);
    return res.status(200).json(albums);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

async function show(req,res){
  const id = req.params.id;
  try{
    const album = await albumService.getAlbum(id);
    return res.status(200).json(album);
  }catch(error){
    return handleErrorResponse(res,error);
  }
}

async function store(req,res){
  const userId = req.user.userId;
  const {name,description} = req.body;
  const validationError = handleValidationErrors({ name, description });
  if (validationError) {
    return res.status(validationError.statusCode).json(validationError.response);
  }
  try{
    const album = await albumService.createAlbum(userId,name,description);
    return res.status(201).json(album);
  }catch(error){
    return handleErrorResponse(res,error);
  }
}

async function update(req,res){
  const id = req.params.id;
  const {name,description} = req.body;
  const validationError = handleValidationErrors({ name, description });
  if (validationError) {
    return res.status(validationError.statusCode).json(validationError.response);
  }
  try{
    const album = await albumService.updateAlbum(id,name,description);
    return res.status(200).json(album);
  }catch(error){
    return handleErrorResponse(res,error);
  }
}

async function destroy(req,res){
  const id = req.params.id;
  try{
    const album = await albumService.deleteAlbum(id);
    return res.status(200).json(album);
  }catch(error){
    return handleErrorResponse(res,error)
  }
}


module.exports = { 
  index,
  indexByUserId,
  show,
  store,
  update,
  destroy 
}