const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const fileUpload = require("express-fileupload");
const { readdirSync } = require("fs");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const compression = require("compression");
const path = require("path");
const fs = require("fs");
const { Server } = require("socket.io");
const SocketServer = require("./SocketServer.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(cookieParser());
app.use(compression());

const corsOptions = {
  origin: "http://localhost:3000", // Allow this origin
  credentials: true, // Allow credentials like cookies or authorization headers
};

app.use(cors(corsOptions));

app.use(
  fileUpload({
    useTempFiles: true,
  })
);

//routes

// backend dizinindeki 'routes' klasörüne mutlak yol ile erişim
const routesPath = path.join(__dirname, "../routes"); // 'backend/routes' yolunu alır

// routes klasöründeki dosyaları oku ve her birini 'app.use' ile kullan
fs.readdirSync(routesPath).forEach((r) => {
  app.use("/", require(path.join(routesPath, r)));
});

//database
mongoose
  .connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => console.log("database connected successfully"))
  .catch((err) => console.log("error connecting to mongodb", err));

const PORT = process.env.PORT || 8000;

let server;

server = app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}..`);
});

//socket.io

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.BASE_URL,
  },
});

io.on("connection", (socket) => {
  console.log("socket io connected successfully");
  SocketServer(socket, io);
});
