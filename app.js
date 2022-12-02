// npm modules
const express = require("express");
const session = require("express-session");
const app = express();
const ejs = require("ejs");
const multer = require("multer");

// custom imports
const connection = require("./config/connection");
const userRouter = require("./routes/user.routes");
const adminRouter = require("./routes/admin.routes");

// session configurations
app.use(function (req, res, next) {
  res.header("Cache-Control", "no-cache, private, no-store, must-revalidate");
  next();
});
app.use(
  session({
    secret: "mykey",
    resave: false,
    saveUninitialized: false,
    store: connection.store,
  })
);

// photo and other file upload using multer
const fileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images/product_img");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + file.originalname);
  },
});

app.use(multer({ storage: fileStorage }).array("imgUrl",5));

// static folder
app.use("/public", express.static("public"));

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.use("*",(req,res)=>{
  res.render('404/404');
})

app.listen(8000, () =>
  console.log("Server running on port http://localhost:8000/")
);
