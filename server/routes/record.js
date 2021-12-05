const express = require("express");
const Url = require('../models/url.js');


// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/conn");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;


//This section will load up the Homepage - Form to Input
recordRoutes.route('/').get(function(req, res) {
  console.log("this is when formview should render")
  res.render('form');
})

// On form submission
recordRoutes.route('/').post(function(req, res){

  const url = new Url(req.body.originalurl, req.body.identifier)
  console.log(req.body)
  console.log(req.body.originalurl)
  console.log(req.body.identifier)
  validUrl = url.validateInputUrl()

  if (validUrl == true) {
    url.addUrlToDb()
    console.log("url added to db")
    res.send(`Thank you for submitting your URL to shorten! The URL you submitted is: ${req.body.originalurl} You can access your URL: Here: `)
    identifierUnique = url.identifierUnique()

  }
  else {
    res.send(`Please enter a valid URL !`)
  }
})

// This section will help you get a list of all the records.
recordRoutes.route("/url").get(function (req, res) {
  let db_connect = dbo.getDb("urls_hub");
  db_connect
    .collection("urls")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// This section will help you get a single record by id
recordRoutes.route("/url/:id").get(function (req, res) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect
      .collection("urls")
      .findOne(myquery, function (err, result) {
        if (err) throw err;
        res.json(result);
      });
});

// This section will help you create a new record.
recordRoutes.route("/url/add").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myobj = {
    url_original: req.body.url_original,
    url_identifier: req.body.url_identifier,
    url_shortened: req.body.url_shortened,
  };
  db_connect.collection("urls").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// This section will help you update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  let newvalues = {
    $set: {
        url_original: req.body.url_original,
        url_identifier: req.body.url_identifier,
        url_shortened: req.body.url_shortened,
    },
  };
  db_connect
    .collection("urls")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 url updated");
      response.json(res);
    });
});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
  let db_connect = dbo.getDb();
  let myquery = { _id: ObjectId( req.params.id )};
  db_connect.collection("urls").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 url deleted");
    response.status(obj);
  });
});

// Redirect for all other requests
recordRoutes.route('/*').get(function(req, res) {
  let url = req.url.substring(1)
  console.log(url)

 // res.send('This should redirect somewhere eventually IF that page is found')
  res.redirect('http://google.com')
})

module.exports = recordRoutes;