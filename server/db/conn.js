const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://localhost:27017";

const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let dbConnection;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      // Verify we got a good "db" object
      if (db)
      {
        dbConnection = db.db("urls");
        console.log("Successfully connected to MongoDB."); 
       // console.log(dbConnection);
      }
      return callback(err);
         });
  },

  getDb: function () {
    return dbConnection;
  },
};