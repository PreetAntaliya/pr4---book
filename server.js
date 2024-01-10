const express = require("express");
const port = 8000;
const app = express();
const db = require("./config/db");
const book = require("./models/book");
app.use(express.urlencoded());

const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { log } = require("console");

app.use("/uploads", express.static(path.join("uploads")));

const fileUpload = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const imageUpload = multer({ storage: fileUpload }).single("avatar");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  book
    .find({})
    .then((record) => {
      return res.render("index", { record });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

app.get("/add", (req, res) => {
  return res.render("add");
});

app.post("/addBook", imageUpload, (req, res) => {
  const { name, price, pages, authore } = req.body;
  if (!name || !price || !pages || !authore || !req.file) {
    return res.redirect("back");
  }

  book
    .create({
      name,
      price,
      pages,
      authore,
      image: req.file.path,
    })
    .then((success) => {
      return res.redirect("back");
    })
    .catch((err) => {
      return false;
    });
});

app.get("/deleteData", (req, res) => {
  let id = req.query.id;
  book
    .findById(id)
    .then((oldRecord) => {
      fs.unlinkSync(oldRecord.image);
    })
    .catch((err) => {
      console.log(err);
      return false;
    });

  book
    .findByIdAndDelete(id)
    .then((success) => {
      console.log("data delete");
      return res.redirect("back");
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

app.get("/editData", (req, res) => {
  let id = req.query.id;
  book
    .findById(id)
    .then((single) => {
      return res.render("edit", {
        single,
      });
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
});

app.post("/updateData", imageUpload, (req, res) => {
  let id = req.body.editid;

  if (req.file) {
    book.findById(id)
      .then((oldRecord) => {
        fs.unlinkSync(oldRecord.image);
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
    book.findByIdAndDelete(id, {
        name: req.body.name,
        price: req.body.price,
        pages: req.body.pages,
        authore: req.body.authore,
        image: req.file.path,
      })
      .then((success) => {
        return res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        return false;
      });
  } else {
    book.findByIdAndUpdate(id, {
        name: req.body.name,
        price: req.body.price,
        pages: req.body.pages,
        authore: req.body.authore,
      })
      .then((success) => {
        return res.redirect("/");
      })
      .catch((err) => {
        console.log(err);
        return res.redirect("back");
      });
  }
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  }
  console.log(`Server Was Running...`);
});
