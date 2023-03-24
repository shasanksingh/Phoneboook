require("dotenv").config();

const path = require("path");
const express = require("express");
const cookiepraser = require("cookie-parser");
const flash = require("express-flash");
const port = process.env.PORT;

require("./config/db");
const Contact = require("./models/contact.model");
const User = require("./models/User");

//require for session
const session = require("express-session");
const passport = require("passport");
require("./config/passport-local");
const MongoStore = require("connect-mongo");

const app = express();
app.use(express.urlencoded());
app.use(express.static("assets"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookiepraser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(
  session({
    name: "something",
    secret: "blahsomething",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URL,
    }),
  })
);

const multer = require("multer");
const File = require("./models/File");
const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split("/")[1];
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage: multerStorage });

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setuser);

app.use("/", require("./routes"));

// form upload stuffs start here

/* {
  fieldname: 'avatar',
  originalname: 'steve-jobs--david-paul-morrisbloomberg-via-getty-images.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  destination: 'uploads',
  filename: 'files/admin-avatar-1632159110949.jpeg',
  path: 'uploads\\files\\admin-avatar-1632159110949.jpeg',
  size: 83952
} */
app.get("/upload", (req, res) => res.render("upload/index"));

app.post("/upload", upload.single("avatar"), (req, res) => {
  console.log(req.file);
  const { originalname, path, size } = req.file;
  File.create({ originalname, path, size }, (err, doc) => {
    if (err) {
      console.error(err);
    }
    req.flash("success", "file uploaded successfully!");
    res.redirect("back");
  });
});

app.get("/showImages", (req, res) => {
  File.find({}, (err, doc) => {
    if (err) console.err(err);
    console.log(doc);
    res.render("upload/show", { images: doc });
  });
});


const contacts = require("./routes/contacts.route.js");

app.use("/contacts", contacts);

// app.get("/", function (req, res) {
//   console.log(req.cookies);
//   Contact.find({}, function (err, contact) {
//     if (err) {
//       console.log("error in the database");
//     }
//     return res.render("contacts", {
//       title: "Google Contacts",
//       contact_list: contact,
//     });
//   });
// });

app.get("/aboutme2", function (req, res) {
  return res.render("b");
});

app.post("/aboutme", function (req, res) {
  Contact.create(
    {
      name: req.body.name,
      number: req.body.number,
    },
    function (err, contact_list) {
      if (err) {
        console.log("error found");
        return;
      }

      console.log("*********", contact_list);
      res.redirect("/");
    }
  );
});

app.get("/delete/:id", function (req, res) {
  const data = req.params.id;
  Contact.findByIdAndDelete(data, function (err) {
    if (err) {
      console.log("error is coming");
    }
  });

  res.redirect("/");
});

// update contact routes by id
app.get("/update/:id", function (req, res) {
  const id = req.params.id;
  Contact.findById(id, function (err, data) {
    if (err) {
      return res.redirect("/");
    } else {
      return res.render("b", { contact: data });
    }
  });
});

app.get("/updates/:id", function (req, res) {
  const data = req.params.id;
  Contact.findById(data, function (err, sucess) {
    if (err) {
      return res.redirect("/");
    } else {
      return res.render("c", { dbb: sucess });
    }
  });
});

app.post("/update/:id", function (req, res) {
  // console.log(req.body.number);
  const id = req.params.id;
  Contact.findByIdAndUpdate(id, req.body, function (err, docs) {
    if (err) {
      console.error(err);
      return res.redirect("/");
    } else {
      return res.redirect("/");
    }
  });
});

app.post("/updates/:id", function (req, res) {
  const data = req.params.id;
  Contact.findByIdAndUpdate(data, req.body, function (err, sucess) {
    if (err) {
      console.log(err);
      return res.redirect("/");
    } else {
      return res.redirect("/");
    }
  });
});
app.get("/framework", passport.authuser, function (req, res) {
  res.render("pro");
});

app.get("/signup", function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/framework");
  }
  return res.render("sign-up");
});

app.post("/signup", function (req, res) {
  if (req.body.password != req.body.conform_password) {
    console.log("your password is incorrect");
  }
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) {
      console.log("error is coming");
      return;
    }
    if (!user) {
      User.create(req.body, function (err) {
        if (err) {
          console.log("error is coming");
          return;
        }
        return res.redirect("/signin");
      });
    }
    if (user) {
      console.log("user is aleady exists ");
    }
  });
});

app.get("/signin", function (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect("/framework");
  }

  return res.render("sign-in");
});
app.post(
  "/createsession",
  passport.authenticate("local", { failureRedirect: "/signin" }),
  function (req, res) {
    return res.redirect("/");
  }
);

app.get("/sign-out", function (req, res) {
  req.logout();
  res.redirect("/");
});

app.listen(port, function (err) {
  if (err) {
    console.log(err);
  }

  console.log("server is working in express", port);
  console.log(process.env.MONGO_URL);
});
