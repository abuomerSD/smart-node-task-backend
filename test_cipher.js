const sqlite = require("sqlite-cipher-updated");
const path = require("path");

let models_file_name = "./utils/"+Date.now().toString()+(Math.round(Math.random()*10000)).toString()+".zip"
sqlite.encrypt(path.resolve(__dirname,"./utils/models.zip"),path.resolve(__dirname,models_file_name),"Y0ur4ESk3yH3r3Y0ur4ESk3yH3r3Y0ur4ESk3yH3r3Y0ur","aes-256-ctr");
