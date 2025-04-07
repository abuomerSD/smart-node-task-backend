const { conn, sequelize } = require("../../../db/conn");


export default [
  // Socket Connection
  global.io.on("connection", async (socket) => {
    socket.on("message", async () => {});

    socket.on("disconnect", async () => {});
  }),
];

