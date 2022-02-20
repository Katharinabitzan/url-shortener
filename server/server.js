const path = require('path');
const express = require("express");
const app = express();
const port = 3000;

// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(require("./routes/record"));

// get driver connection
const dbo = require("./db/conn");

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) console.error(err);
  });

  console.log(`Server is running on port: ${port}`);
});