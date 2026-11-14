import multer from "multer";
import path from "path";
import fs from "fs";


const createMedicalRecordUploadMiddleware = () => {

  const baseUploadPath = path.join(
    process.cwd(),
    "uploads",
    "medical-records"
  );


  const prescriptionPath = path.join(
    baseUploadPath,
    "prescriptions"
  );

  const labReportPath = path.join(
    baseUploadPath,
    "lab-reports"
  );

  const otherPath = path.join(
    baseUploadPath,
    "other"
  );


  /* =====================================================
     CREATE DIRECTORIES
  ===================================================== */

  [
    prescriptionPath,
    labReportPath,
    otherPath,
  ].forEach((folder) => {

    if (!fs.existsSync(folder)) {

      fs.mkdirSync(folder, {
        recursive: true,
      });

    }

  });


  /* =====================================================
     STORAGE
  ===================================================== */

  const storage = multer.diskStorage({

    destination(req, file, cb) {

      if (file.fieldname === "prescriptionFile") {

        cb(null, prescriptionPath);

      } else if (file.fieldname === "labReportFile") {

        cb(null, labReportPath);

      } else if (file.fieldname === "otherMedicalFile") {

        cb(null, otherPath);

      } else {

        cb(
          new Error(
            "Invalid medical document field"
          )
        );

      }

    },


    filename(req, file, cb) {

      const uniqueName =
        Date.now() +
        "-" +
        Math.round(Math.random() * 1000000) +
        path.extname(file.originalname);


      cb(null, uniqueName);

    },

  });


  /* =====================================================
     FILE FILTER
  ===================================================== */

  const fileFilter = (req, file, cb) => {

    const allowedExtensions = [
      ".jpg",
      ".jpeg",
      ".png",
      ".webp",
      ".pdf",
    ];


    const extension =
      path
        .extname(file.originalname)
        .toLowerCase();


    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];


    if (
      allowedExtensions.includes(extension) &&
      allowedMimeTypes.includes(file.mimetype)
    ) {

      cb(null, true);

    } else {

      cb(
        new Error(
          "Only PDF, JPG, JPEG, PNG and WEBP files are allowed"
        )
      );

    }

  };


  return multer({

    storage,

    fileFilter,

    limits: {
  fileSize: 50 * 1024 * 1024,
  files: 3,
},

  });

};


export default createMedicalRecordUploadMiddleware;