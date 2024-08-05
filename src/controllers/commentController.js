const commentService = require("../services/commentService");
const customError = require("../utils/customError");

function validatePostData({  content }) {
  const errors = {};
  if (!content) errors.content = "Content is required";
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

async function commentPost(req, res) {
  const postId = req.params.id;
  const userId = req.user.userId;
  const { content } = req.body;

  const validationError = handleValidationErrors({ content });
  if (validationError) {
    return res
      .status(validationError.statusCode)
      .json(validationError.response);
  }
  try {
    const comment = await commentService.createComment(postId, userId, content);
    return res.status(201).json(comment);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

async function uncommentPost(req, res) {
  const commentId = req.params.id;
  const userId = req.user.userId;
  try {
    const uncomment = await commentService.deleteComment(commentId, userId);
    return res.status(200).json(uncomment);
  } catch (error) {
    return handleErrorResponse(res, error);
  }
}

module.exports = {
  commentPost,
  uncommentPost,
};
