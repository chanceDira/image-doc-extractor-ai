const tesseract = require("node-tesseract-ocr");

const express = require("express");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.static(path.join(__dirname + "/uploads")));

app.set("view engine", "ejs");

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index", { data: "" });
});

app.post("/extract", upload.single("file"), (req, res) => {
  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  };

  tesseract
    .recognize(req.file.path, config)
    .then((text) => {
      res.render("index", { data: text });
    })
    .catch((error) => {
      console.log(error.message);
    });
});

app.listen(4000, () => {
  console.log("App is listening on port 4000");
});
