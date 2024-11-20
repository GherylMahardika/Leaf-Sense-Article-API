const { storage, bucketName } = require('./storage');
const pool = require('./db');
const { nanoid } = require('nanoid');
const path = require('path');

const addArticle = async (req, res) => {
    try {
        const { title, content, plantType } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ status: 'fail', message: 'Image file is required' });
        }

        // Generate unique file name and upload to Cloud Storage
        const fileName = `${nanoid()}-${path.basename(file.originalname)}`;
        const bucket = storage.bucket(bucketName);
        const blob = bucket.file(fileName);

        const blobStream = blob.createWriteStream({ resumable: false });

        blobStream.on('error', (err) => {
            return res.status(500).json({ status: 'error', message: err.message });
        });

        blobStream.on('finish', async () => {
            const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;

            // Save to MySQL database
            const id = nanoid(16);
            const createdAt = new Date();
            const updatedAt = createdAt;
            const sql = `
                INSERT INTO articles (id, title, content, plantType, imageUrl, createdAt, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            const values = [id, title, content, plantType, publicUrl, createdAt, updatedAt];

            await pool.query(sql, values);

            res.status(201).json({
                status: 'success',
                message: 'Article added successfully',
                data: { id, title, content, plantType, imageUrl: publicUrl, createdAt, updatedAt },
            });
        });

        blobStream.end(file.buffer);
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// Mendapatkan semua artikel
const getAllArticles = async (req, res) => {
  try {
      // Query to get all articles
      const sql = `SELECT * FROM articles ORDER BY createdAt DESC`;
      const [rows] = await pool.query(sql);

      res.status(200).json({
          status: 'success',
          data: rows,
      });
  } catch (error) {
      console.error('Error fetching articles:', error.message); // Log the error to the console
      res.status(500).json({
          status: 'error',
          message: error.message || 'Internal Server Error',
      });
  }
};


// Mendapatkan artikel berdasarkan ID
const getArticleById = async (req, res) => {
  try {
      const { id } = req.params;
      const sql = `SELECT * FROM articles WHERE id = ?`;
      const [rows] = await pool.query(sql, [id]);

      if (rows.length === 0) {
          return res.status(404).json({ status: 'fail', message: 'Article not found' });
      }

      res.status(200).json({
          status: 'success',
          data: rows[0],
      });
  } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
  }
};

// Memperbarui artikel
const updateArticle = async (req, res) => {
  try {
      const { id } = req.params;
      const { title, content, plantType } = req.body;
      const file = req.file;

      const sql = `SELECT * FROM articles WHERE id = ?`;
      const [rows] = await pool.query(sql, [id]);

      if (rows.length === 0) {
          return res.status(404).json({ status: 'fail', message: 'Article not found' });
      }

      const article = rows[0];
      let imageUrl = article.imageUrl;

      if (file) {
          const fileName = `${nanoid()}-${path.basename(file.originalname)}`;
          const bucket = storage.bucket(bucketName);
          const blob = bucket.file(fileName);

          const blobStream = blob.createWriteStream({ resumable: false });

          blobStream.on('error', (err) => {
              return res.status(500).json({ status: 'error', message: err.message });
          });

          blobStream.on('finish', async () => {
              const newImageUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
              const oldFile = bucket.file(imageUrl.split('/').pop());

              // Delete the old image from Cloud Storage
              await oldFile.delete().catch(() => {});
              imageUrl = newImageUrl;

              const updatedAt = new Date();
              const updateSql = `
                  UPDATE articles
                  SET title = ?, content = ?, plantType = ?, imageUrl = ?, updatedAt = ?
                  WHERE id = ?
              `;
              const values = [title, content, plantType, imageUrl, updatedAt, id];

              await pool.query(updateSql, values);

              res.status(200).json({ status: 'success', message: 'Article updated successfully' });
          });

          blobStream.end(file.buffer);
      } else {
          const updatedAt = new Date();
          const updateSql = `
              UPDATE articles
              SET title = ?, content = ?, plantType = ?, updatedAt = ?
              WHERE id = ?
          `;
          const values = [title, content, plantType, updatedAt, id];

          await pool.query(updateSql, values);

          res.status(200).json({ status: 'success', message: 'Article updated successfully' });
      }
  } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
  }
};

// Menghapus artikel
const deleteArticle = async (req, res) => {
  try {
      const { id } = req.params;

      const sql = `SELECT * FROM articles WHERE id = ?`;
      const [rows] = await pool.query(sql, [id]);

      if (rows.length === 0) {
          return res.status(404).json({ status: 'fail', message: 'Article not found' });
      }

      const article = rows[0];
      const bucket = storage.bucket(bucketName);
      const file = bucket.file(article.imageUrl.split('/').pop());

      // Delete the image from Cloud Storage
      await file.delete().catch(() => {});

      // Delete the article from the database
      await pool.query(`DELETE FROM articles WHERE id = ?`, [id]);

      res.status(200).json({ status: 'success', message: 'Article deleted successfully' });
  } catch (error) {
      res.status(500).json({ status: 'error', message: error.message });
  }
};

module.exports = {
  addArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
};
