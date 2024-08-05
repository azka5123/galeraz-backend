const likeService = require("../services/likeService");
const customError = require("../utils/customError");

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

async function likePost(req, res) {
  const  postId  = req.params.id;
  const  userId  = req.user.userId;
//   console.log(postId, userId);
  try {
    const like = await likeService.createLike(postId, userId);
    return res.status(201).json(like);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

async function unlikePost(req, res) {
  const  postId = req.params.id;
  const  userId = req.user.userId;
//   console.log(postId, userId);
  try {
    const unlike = await likeService.deleteLike(postId, userId);
    return res.status(200).json(unlike);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

module.exports = {
  likePost,
  unlikePost
};
