const fileEasyUpload = require("express-easy-fileuploader");
const { path } = require("../server");


const file_handler = async (req, res, next) => {
  try {
    const fileName = ["image", "file", "img","posDoc"];
    const directoryPath = "public/"+ req.originalUrl.split("/api/")[1]?.split("/")[0];
    if (req.files) {
      for (var i = 0; i < fileName.length; i++) {
        if (Array.isArray(req.files[fileName[i]])) {
          var paths = [];
          if (req.files[fileName[i]]) {
            console.log(req.files[fileName[i]].length);
            for (var j = 0; j < req.files[fileName[i]].length; j++) {
              paths.push(await req[fileName[i]][j].save(directoryPath));
            }
            req.body[fileName[i]] = JSON.stringify(paths);
          }
        } else {
          if (req.files[fileName[i]]) {
            console.log(req.files[fileName[i]]);
            req.body[fileName[i]] = await req[fileName[i]].save(directoryPath);
          }
        }
      }
    }
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = file_handler;
