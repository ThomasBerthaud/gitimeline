var express = require("express");
var path = require("path");
var morgan = require("morgan");
var app = express();
var apiRouter = require("./apiRouter");

app.use(morgan("tiny"));
app.use(express.static(path.join(__dirname, "../dist")));
app.use("/api", apiRouter);

app.listen(3000, function() {
  console.log("Example app listening on port 3000!");
});
