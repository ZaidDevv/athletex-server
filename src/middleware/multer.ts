import multer from 'multer';
import path from 'path';
import fs from 'fs';
// Set up disk storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // check if the directory exists and create it if it doesn't
        if (!fs.existsSync(path.join(process.cwd(), "src",'public', 'uploads'))) {
            fs.mkdirSync(path.join(process.cwd(), "src",'public', 'uploads'));
        }
        cb(null, path.join(process.cwd(), "src",'public', 'uploads'));
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    },
});

// Create the Multer instance
const upload = multer({ storage });

export default upload;