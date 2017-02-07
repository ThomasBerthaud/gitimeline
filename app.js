var express = require('express')
var path = require('path');
var app = express()

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})