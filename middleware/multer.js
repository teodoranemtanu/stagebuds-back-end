const multer = require('multer');
const DatauriParser = require('datauri/parser');
const path = require('path');

const storage = multer.memoryStorage();

const multerUploads = multer({storage}).single('image');
const dUri = new DatauriParser();

const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);

exports.multerUploads = multerUploads;
exports.dataUri = dataUri;