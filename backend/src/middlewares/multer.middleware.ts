import multer from "multer";
import fs from "fs"

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {

        const path = "./public/temp"
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path, { recursive: true })
        }
        return cb(null, path)
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    }
});

// Create the multer instance
export const upload = multer({ storage });