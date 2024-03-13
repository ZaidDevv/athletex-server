import multer from 'multer';
import path from 'path';

// Set up disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Specify the destination folder where files will be stored
        cb(null, 'src/public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
});

// Create the Multer instance
const upload = multer({ storage });

export default upload;