const multer = require('multer');
const path = require('path');

// Konfigurasi multer untuk menyimpan file sementara
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Maksimal 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('File harus berupa gambar (JPEG, PNG, JPG).'));
    }
    cb(null, true);
  },
});

module.exports = upload;