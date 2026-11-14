// import multer from "multer";
// import path from "path";

// const storage=multer.diskStorage({
//     destination(req,file,cb){
//         cb(null,"uploads/doctors");
//     },
//     filename(req,file,cb){
//         cb(
//             null,
//             Date.now()+"-"+Math.round(Math.random() * 1000000) +path.extname(file.originalname)
//         );
//     },
// });
// const fileFilter=(req,file,cb)=>{
//     const allowed=/jpg|jpeg|png|webp/;
//     const ext=allowed.test(
//         path.extname(file.originalname).toLowerCase()
//     );
//     const mime=allowed.test(file.mimetype);

//     if(ext && mime){
//         cb(null,true)
//     }else{
//         cb(new Error("Only jpg,jpeg,png,webp images are allowed"))
//     }
// };

// export default multer({
//     storage,
//     fileFilter,
//     limits:{
//         fileSize:2*1024*1024,
//     },
// })


import multer from "multer";
import path from "path";
import fs from "fs";

const createUploadMiddleware = (folder) => {

  const uploadPath = path.join(
    process.cwd(),
    "uploads",
    folder
  );

  // Create folder if it doesn't exist
  if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, {
      recursive: true,
    });
  }

  const storage = multer.diskStorage({

    destination(req, file, cb) {

      cb(null, uploadPath);

    },

    filename(req, file, cb) {

      cb(
        null,
        Date.now() +
          "-" +
          Math.round(Math.random() * 1000000) +
          path.extname(file.originalname)
      );

    },

  });

  const fileFilter = (req, file, cb) => {

    const allowed = /jpg|jpeg|png|webp/;

    const ext = allowed.test(
      path.extname(file.originalname).toLowerCase()
    );

    const mime = allowed.test(
      file.mimetype
    );

    if (ext && mime) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only jpg, jpeg, png, webp images are allowed"
        )
      );

    }

  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
  });

};

export default createUploadMiddleware;