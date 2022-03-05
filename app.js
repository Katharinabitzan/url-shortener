const express = require("express");
const app = express();

require('./server/startup/routes')(app);
require('./server/startup/db')();

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});