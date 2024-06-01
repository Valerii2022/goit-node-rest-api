import Jimp from "jimp";

const resizeImage = async (req, file, next) => {
  if (req.file) {
    Jimp.read(req.file.path, (err, avatar) => {
      if (err) throw err;
      avatar
        .resize(250, 250)
        .quality(60)
        .greyscale()
        .write("./public/avatars/" + req.file.filename);
    });
  }
  next();
};

export default resizeImage;
