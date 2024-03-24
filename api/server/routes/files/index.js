npm install express-async-errors


const express = require('express');
const createMulterInstance = require('./multer');
const { uaParser, checkBan, requireJwtAuth, createFileLimiters } = require('~/server/middleware');
const { files, images, avatar } = require('./routes');
const { handleFileUpload, handleImageUpload } = require('./handlers');
const { errorHandler } = require('~/server/error-handling');

const initialize = async () => {
  const router = express.Router();
  router.use(requireJwtAuth);
  router.use(checkBan);
  router.use(uaParser);
  router.use(errorHandler);

  const upload = await createMulterInstance().catch((err) => {
    // Handle error here
    console.error('Error creating Multer instance:', err);
  });

  const { fileUploadIpLimiter, fileUploadUserLimiter } = createFileLimiters().catch((err) => {
    // Handle error here
    console.error('Error creating file limiters:', err);
  });

  router.post('*', fileUploadIpLimiter, fileUploadUserLimiter);

  router.post('/', handleFileUpload(upload));
  router.post('/images', handleImageUpload(upload));

  router.use('/', files);
  router.use('/images', images);
  router.use('/images/avatar', avatar);

  return router;
};

const handleFileUpload = (upload) => async (req, res, next) => {
  try {

