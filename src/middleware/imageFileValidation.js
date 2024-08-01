// imageValidation.js
function imageFileValidation(req, res, next) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  const maxSize = 10 * 1024 * 1024; // 4MB

  for (const [key, file] of Object.entries(req.files)) {
    if (!validTypes.includes(file.mimetype)) {
      return res.status(400).send(`Invalid file type for ${key}. Only image files are allowed.`);
    }

    if (file.size > maxSize) {
      return res.status(400).send(`File size for ${key} exceeds the limit of 10MB.`);
    }
  }

  next();
}

module.exports = imageFileValidation;
