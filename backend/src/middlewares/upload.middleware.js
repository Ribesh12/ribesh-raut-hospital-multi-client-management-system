import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directories exist
const uploadsDir = path.join(__dirname, '../../uploads');
const doctorPhotosDir = path.join(uploadsDir, 'doctors');
const hospitalImagesDir = path.join(uploadsDir, 'hospitals');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
if (!fs.existsSync(doctorPhotosDir)) {
  fs.mkdirSync(doctorPhotosDir, { recursive: true });
}
if (!fs.existsSync(hospitalImagesDir)) {
  fs.mkdirSync(hospitalImagesDir, { recursive: true });
}

// Configure storage for doctor photos
const doctorPhotoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, doctorPhotosDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `doctor-${uniqueSuffix}${ext}`);
  }
});

// Configure storage for hospital images
const hospitalImageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, hospitalImagesDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `hospital-${uniqueSuffix}${ext}`);
  }
});

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
  }
};

// Doctor photo upload middleware
export const uploadDoctorPhoto = multer({
  storage: doctorPhotoStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFilter,
}).single('photo');

// Hospital profile picture upload middleware
export const uploadHospitalProfilePicture = multer({
  storage: hospitalImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: imageFilter,
}).single('profilePicture');

// Hospital images upload middleware (multiple)
export const uploadHospitalImages = multer({
  storage: hospitalImageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: imageFilter,
}).array('images', 10); // Max 10 images at a time

// Generic error handler for multer
export const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File size too large. Maximum allowed size exceeded.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ error: 'Too many files. Maximum 10 files allowed.' });
    }
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};
