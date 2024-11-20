const { Storage } = require('@google-cloud/storage');

const storage = new Storage();
const bucketName = 'leaf-sense-storage';

module.exports = { storage, bucketName };