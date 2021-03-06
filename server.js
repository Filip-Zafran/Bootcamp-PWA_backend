const express = require("express");
const app = express();
const port = process.env.PORT || 5000;

const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./keys").mongoURI;

const mongoose = require("mongoose");

const passport = require("passport");
require("../server/passport")(passport);

app.use(passport.initialize());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

mongoose
  .connect(db, { useNewUrlParser: true, useCreateIndex: true })
  .then(() => console.log("Connection to Mongo DB established"))
  .catch(err => console.log(err));
app.use("/cities", require("./routes/cities"));
app.use("/itineraries", require("./routes/itinerary"));
app.use("/user", require("./routes/userRoute"));
app.use("/login", require("./routes/logRoute"));
app.listen(port, () => {
  console.log("Server is running on " + port + "port");
});
