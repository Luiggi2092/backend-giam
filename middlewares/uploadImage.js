const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");



const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/images/"));
},
  filename: function (req, file, cb) {
    const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniquesuffix + ".jpeg");
},
});


const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/png") || file.mimetype.startsWith("image/jpeg") || file.mimetype.startsWith("image/webp")) {
    cb(null, true);
} else {
    cb({ message: "Unsupported file format" }, false);
}
};


const uploadPhoto = multer({
  storage: storage,
  fileFilter: multerFilter,
  limits: { fileSize: 1000000 },
});


const productImgResize = async (req, res, next) => {
  console.log("hola");
  if (!req.files) return next();
await Promise.all(
  req.files.map(async (file) => {
    //console.log(file.path);
  await sharp(file.path)
    .resize(1000, 1000)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`D:/tiendaAmber/giamshp/backend/public/images/products/${file.filename}`);
    fs.unlinkSync(`D:/tiendaAmber/giamshp/backend/public/images/products/${file.filename}`);
})
).catch(error => console.log(error));
  next();
};

const blogImgResize = async (req, res, next) => {
  if (!req.files) return next();
  await Promise.all(
req.files.map(async (file) => {
    await sharp(file.path)
    .resize(300, 300)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/images/blogs/${file.filename}`);
fs.unlinkSync(`public/images/blogs/${file.filename}`);
})
);
  next();
};



module.exports = { uploadPhoto, productImgResize, blogImgResize };