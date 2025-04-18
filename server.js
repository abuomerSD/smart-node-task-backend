const express = require("express");

const dotenv = require("dotenv");
const path = require("path");
dotenv.config({ path: "./config/config.env" });
global.loadLocaleMessages = require("locnode-updated")(path.resolve(__dirname, "./locales"));
// const {sequelize } = require("./db/conn.js");

const convertQueryStringsToItType = require('./middleware/convertQueryStringsToItType.js');

const cors = require("cors");
const fileEasyUpload = require("express-easy-fileuploader");
const file_upload = require("./middleware/media_middleware");




const users = require("./routes/Users");
const user_roles = require("./routes/UserRoles");
const categories =require('./routes/Categories.js');
const products = require('./routes/Products.js');
const salesOrder = require('./routes/SalesOrder.js');
const salesCreditNotes = require('./routes/SalesCreditNotes.js');
const productLogs = require('./routes/ProductLogs.js');
const transactions = require('./routes/Transactions.js');
const customers = require('./routes/Customers.js')

const { logger } = require("./middleware/logger.js");

// charts APIs routes file

const app = express();
const bodyParser = require("body-parser");
const detector = require("./middleware/pos_hub_detector.js");
const { conn, sequelize } = require("./db/conn");
const utils = require("./utils/utils.js");
// const authenticate = require('./middleware/authenticate.js')
app.use(bodyParser.json());
// logger
app.use(logger);
// app.use(authenticate)
app.use(cors());
app.use(
  fileEasyUpload({
    app,
    fileUploadOptions: {
      limits: { fileSize: 500 * 1024 * 1024 },
      multiple: true,
    },
    
  })
);
app.use(detector);

app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public/"));
// app.use(express.static(path.join(__dirname, "uploads")));
// app.use(file_upload);
app.use(convertQueryStringsToItType);


app.use("/api/user-roles", user_roles);
app.use("/api/users", users);
app.use('/api/categories', categories);
app.use('/api/products', products);
app.use('/api/sales-order', salesOrder);
app.use('/api/sales-credit-notes', salesCreditNotes);
app.use('/api/product-logs', productLogs);
app.use('/api/transactions', transactions);
app.use('/api/customers', customers)


// charts APIs



app.get("/.*/", (req, res) => {
  res.sendFile(__dirname, "/public/index.html");
});


const PORT = 5020;
var server = app.listen(PORT, () =>
  console.log(`server is running on ,port is  ${PORT} `)
);


// Socket IO
global.io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    allowEI03: true,
    rejectUnauthorized: false,
  },
});



// Socket Connection
io.on("connection", async (socket) => {
  console.log("socket query :", socket.handshake.query);

  socket.on("add_me_to_room", (topic_id) => {
    console.log("join ", topic_id);
    socket.join(topic_id);
  });

  socket.on("remove_me_from_room", (topic_id) => {
    socket.leave(topic_id);
    console.log("left room  ", topic_id);

    // socket.to(topic_id).emit(`user $`)
  });

  socket.on("chat", async (obj) => {
    console.log("message :", obj);
    console.log("socket info :", socket.handshake.time);
    obj.created = new Date().toISOString();
    io.to(Number(obj.topic_id)).emit("chat", obj);

    await conn.topic_chats.create(obj);
  });

  socket.on("disconnect", async () => {
    console.log("disconnect");
  });


});

module.exports = app;
