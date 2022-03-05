const { MongoClient } = require("mongodb")
const url = "mongodb://localhost:27017";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = function() {
    client.connect(function (err, db) {
      // Verify we received a good "db" object
      if (db) {
        dbConnection = db.db("urls");
        console.log("Successfully connected to MongoDB.");
      }
    });
  }