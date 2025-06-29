import multer from "multer";

const fileStorageA = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/avatar");
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString().replace(/:/g, "_") + file.originalname)
	}
});

export const uploadA = multer({storage: fileStorageA});

const fileStorageB = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "./uploads/posts");
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString().replace(/:/g, "_") + file.originalname)
	}
});

export const uploadB = multer({storage: fileStorageB});


