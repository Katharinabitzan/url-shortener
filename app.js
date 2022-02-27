const path = require('path');
const express = require("express");
const app = express();
const port = 3000;

// View Engine Setup
app.set('views', path.join(__dirname, '/public/views'));
app.set('view engine', 'ejs');
app.use(express.json());
// app.use(express.static("public"));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({
  extended: true
}));
app.use(require("./server/routes/record"));

// get driver connection
const dbo = require("./server/db/conn");

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });

  console.log(`Server is running on port: ${port}`);
});