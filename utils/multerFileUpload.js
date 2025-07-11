import path from "path";
import multer from "multer";
import fs from "fs";

// Create uploads directory if it doesn't exist
const ensureUploadsDir = () => {
  const uploadsPath = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, { recursive: true });
  }
};
ensureUploadsDir();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(process.cwd(), "uploads");
    cb(null, uploadPath);
  },

  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname).toLowerCase(); //file extension like .jpg, .png, .webp
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${extname}`);
    // cb(null, `${file.fieldname}-${Date.now()}${extname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only"), false);
  }
};
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB limit
  files: 1, // Single file upload
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  // limits: limits,
});
export default upload;
