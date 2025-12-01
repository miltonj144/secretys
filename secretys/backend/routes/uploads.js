module.exports = () => {
  const express = require('express');
  const router = express.Router();

  // In produção: gere URL preassinada S3
  router.post('/presigned', (req, res) => {
    const { filename } = req.body;
    const url = `https://secretys-media.s3.amazonaws.com/${filename}`;
    res.json({ url, expiresIn: 3600 });
  });

  return router;
};
