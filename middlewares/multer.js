// import multer from "multer";
// import path from 'path';
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/Images');
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
//     }
// });
// const upload =multer({
//    storage:storage, 
// })

// const singleUpload = upload.single("file");

// export default singleUpload;

// uploading files to cloudinary ------------------
 
import multer from 'multer';

const storage=multer.memoryStorage();

const singleUpload=multer({storage}).single('file');

export default singleUpload;