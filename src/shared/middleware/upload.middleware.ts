import fs from 'fs';
import { Request } from 'express';
import multer, { FileFilterCallback } from 'multer';

const uploadDir = 'uploads/posts';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, uploadDir);
    },
    filename: (_req, file, cb) => {
        const timestamp = Date.now();
        const sanitized = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
        cb(null, `${timestamp}-${sanitized}`);
    },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

export const uploadMiddleware = multer({
    storage,
    fileFilter,
    limits: {
        // Máximo 5MB por archivo
        fileSize: 5 * 1024 * 1024,
        // Máximo 4 imágenes por post
        files: 4,
    },
});
