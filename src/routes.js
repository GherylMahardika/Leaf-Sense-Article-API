const express = require('express');
const upload = require('./middleware/upload');
const multer = require('multer');
const {
  addArticle,
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
} = require('./handler');

const router = express.Router();

router.post('/articles', upload.single('image'), addArticle);
router.get('/articles', getArticles);
router.get('/articles/:id', getArticleById);
router.put('/articles/:id', upload.single('image'), updateArticle);
router.delete('/articles/:id', deleteArticle);

module.exports = router;