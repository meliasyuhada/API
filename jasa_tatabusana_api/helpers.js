var multer = require('multer');
var path = require('path');

exports.imageFilter = function(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

exports.storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/img/');
    },
    filename: function(req,file, cb) {
        cb(null, file.fieldname + '-' + DataTransfer.now() + path.extname(file.originalname));
    }
});