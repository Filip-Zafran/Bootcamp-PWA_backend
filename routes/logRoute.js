const express = require("express");
const router = express.Router();
const userModel = require("../model/userModel");

const key = require("../keys");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcrypt");

router.post("/LogIn", async (req, res) => {
  // check("name", "Username is required").notEmpty();
  // check("createPass", "Password is required").notEmpty();

  // var errors = validationResult(req);
  const name = req.body.name;
  const password = req.body.createPass;
  console.log("log in route", req.body);

  // if (!errors.isEmpty()) {
  //   return res.status(400).json(errors);
  // }

  // 2. THEN LOGIN COMPONENT ACTIONS

  userModel
    .findOne({ name })
    .then(user => {
      if (!user) {
        return res.status(400).json({
          result: "No user found with the inputed name"
        });
      } else {
        // check if password i correctly called
        // return res.status(200).json({
        //   user,
        //   result: "Login succesfull"

        bcrypt.compare(password, user.createPass, function(err, result) {
          if (result) {
            const payload = {
              name: user.name,
              email: user.email,
              avatar: user.avatar,
              favouriteItineraries: user.favouriteItineraries
            };

            console.log(payload);

            const options = { expiresIn: 2592000 };
            jwt.sign(payload, key.secretOrKey, options, (err, token) => {
              if (err) {
                res.json({
                  success: false,
                  token: "There was an error"
                });
              } else {
                res.json({
                  success: true,
                  token: token
                });
              }
            });
          }
        });

        // DISPLAY THESE MESSAGES IN COMPONENT (?)
        //  else {
        //   return res.status(200).json({
        //     result: "Password was incorrect"
        //   });
        // }
      }
    })

    .catch(err => {
      console.log(err);
      res.send(err);
    });
});

//log route
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    userModel
      .findOne({ _id: req.user.id })
      .then(user => {
        res.json(user);
      })
      .catch(err => res.status(404).json({ error: "User does not exist!" }));
  }
);

module.exports = router;
