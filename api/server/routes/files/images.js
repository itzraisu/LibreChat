const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const { filterFile, processImageFile } = require('~/server/services/Files/process');
const { logger } = require('~/config');

const router = express.Router();

router.post('/', async (req, res) => {
  const metadata = req.body;
  const file = req.file;

  // Validate metadata and file before processing
  if (!metadata || !file) {
    return res.status(400).json({ message: 'Invalid request' });
  }

  try {
    // Handle errors in filterFile and processImageFile
    await filterFile({ req, file: req.file, image: true })
      .catch((error) => {
        logger.error('[/files/images] Error filtering file:', error);
        throw error;
      });

    metadata.temp_file_id = metadata.file_id;
    metadata.file_id = req.file_id;

    await processImageFile({ req, res, file: req.file, metadata })
      .catch((error) => {
        logger.error('[/files/images] Error processing file:', error);
        throw error;
      });

    res.status(200).json({ message: 'File processed successfully' });
  } catch (error) {
    // Delete remote file if it exists
    try {
      const filepath = path.join(
        req.app.locals.paths.imageOutput,
        req.user.id,
        path.basename(req.file.filename),
      );
      await fs.unlink(filepath);
    } catch (error) {
      logger.error('[/files/images] Error deleting file:', error);
   
