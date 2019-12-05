const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("users");
const requireLogin = require("../middlewares/requireLogin");

module.exports = app => {
  app.post("/auth/local", (req, res) => {
    const {
      name,
      surname,
      username,
      password,
      email,
      idCardNum,
      DLicenseNumber,
      tel,
      isProvider
    } = req.body;
    console.log("REGISTER")
    console.log(req.body)
    // check validation
    if (name.length < 3) {
      return res.json({message: "Name Invalid"})
    }
    if (surname.length < 3) {
      return res.json({message: "Surname Invalid"})
    }
    if (username.length < 6) {
      return res.json({message: "Username Invalid"})
    }
    if (password.length < 6) {
      return res.json({message: "Password Invalid"})
    }
    if (!email.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)) {
      return res.json({message: "Email Invalid"})
    }
    if (idCardNum.length < 13 || idCardNum.length > 13) {
      return res.json({message: "IdCardNum Invalid"})
    }
    if (tel.length < 10 || tel.length > 10) {
      return res.json({message: "Telephone Invalid"})
    }
    
    

    User.register(
      new User({
        username,
        name,
        surname,
        email,
        idCardNum,
        DLicenseNumber,
        tel,
        isProvider
      }),
      password,
      (err, user) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ message: "Sign Up Error"})
        }
        passport.authenticate("local")(req, res, function() {
          console.log(res)
          res.status(200).json({message: "Sign Up Success"});
        });
      }
    );
  });
  app.post(
    "/auth/login",
    passport.authenticate("local", {
    }),
    (req, res) => {
      if (req.user) { res.status(200).send(req.user); }
      else { res.status(401).json({message: "Login Error"}); }
    }
  );
  app.get("/api/logout", (req, res) => {
    // logout
    req.logout();
    res.redirect("/");
  });

  app.get("/api/current_user", (req, res) => {
    // get current user
    console.log(req.user || req.session.user)
    res.send(req.user);
  });

  app.get("/api/user/:userID", async (req, res) => {
    // get specific user
    const user = await User.findOne({_id: req.params.userID})
    res.send(user);
  });
};
