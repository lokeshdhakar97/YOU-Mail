const express = require('express');
const passport = require('passport');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');

const userModel = require('../model/user');
const mailModel = require("../model/mails");

const localStrategy = require('passport-local');

passport.use(new localStrategy(userModel.authenticate()));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/uploads')
  },
  filename: function (req, file, cb) {
    const fn = Date.now() + Math.floor(Math.random() * 10000) + file.originalname;
    cb(null, fn)
  }
})

function fileFilter(req, file, cb) {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg" || file.mimetype === "image/png" || file.mimetype === "image/webp") {
    cb(null, true);
  } else {
    cb(new Error("This is a error"));
  }
}
const upload = multer({ storage, fileFilter }).single('image');

router.post("/send-mail", isLoggedIn, async function (req, res) {
  const loggedInUser = await userModel.findOne({ username: req.session.passport.user });
  const reciverUser = await userModel.findOne({ email: req.body.reciverMail });
  const createdMail = await mailModel.create({
    reciverMail: req.body.reciverMail,
    senderUserId: loggedInUser._id,
    reciverUserId: reciverUser._id,
    message: req.body.message,
    subject: req.body.subject,
  });
  loggedInUser.sentMails.push(createdMail._id);
  loggedInUser.save();
  reciverUser.recivedMails.push(createdMail._id);
  reciverUser.save();
  console.log(reciverUser._id);
  res.redirect(req.headers.referer);
});

router.get("/check/:username", function (req, res) {
  userModel.findOne({ username: req.params.username }).then(function (user) {
    res.json(user);
  });
});

router.post('/setpic', isLoggedIn, async function (req, res) {
  upload(req, res, async function (err) {
    if (err) {
      res.send("<h1>Hey User, Only Images Are Allowed....😖😖</h1>");
    }
    let loggedInUser = await userModel.findOne({ username: req.session.passport.user });
    loggedInUser.profilePic = req.file.filename;
    loggedInUser.save();
    res.redirect(req.headers.referer);
  });
});

router.get('/', isAlreadyLoggedIn, function (req, res, next) {
  res.render('login');
});

// Login the account by username and passport
router.post('/login', passport.authenticate('local', {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function (req, res, next) { });

// Show login page if user wirte /login routes on url if it's not logged then redirect on / otherwise redirect on profile routes
router.get("/login", isAlreadyLoggedIn, function (req, res) {
  res.redirect("/");
})

// Show register page 
router.get('/register', isAlreadyLoggedIn, function (req, res, next) {
  res.render('register');
});

// Submit the register form 
router.post('/register', function (req, res, next) {
  var newUser = new userModel({
    fullname: req.body.fullname,
    username: req.body.username,
    email: req.body.email,
    gender: req.body.gender,
  });
  userModel.register(newUser, req.body.password)
    .then(function (u) {
      passport.authenticate('local')(req, res, function () {
        res.redirect('/profile');
      })
    })
    .catch(function (e) {
      res.send(e);
    })
})

// Show the profile page after login 
router.get('/profile', isLoggedIn, async function (req, res, next) {
  const foundUser = await userModel.findOne({ username: req.session.passport.user })
    .populate({
      path: "recivedMails",
      populate: {
        path: 'senderUserId'
      }
    });
  res.render('profile', { user: foundUser });
});

// Log Out the account which is login.
router.get('/logout', isLoggedIn, function (req, res) {
  req.logOut(function (err) {
    if (err) throw err;
    res.redirect('/');
  })
})
router.get('/show/sent-mails', isLoggedIn, async function (req, res, next) {
  const foundUser = await userModel.findOne({ username: req.session.passport.user }).populate("sentMails");
  res.json(foundUser);
});
// isLoggedIn Middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/');
  }
}
// Already Logged In Middleware
function isAlreadyLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/profile")
  } else {
    return next()
  }
}

module.exports = router;
