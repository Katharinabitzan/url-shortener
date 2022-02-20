const express = require("express");
const Url = require('../models/url.js');
const recordRoutes = express.Router();
const dbo = require("../db/conn");
let url = new Url();

// Help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Load up the Homepage - Form to Input
recordRoutes.route('/').get(function(req, res) {
  res.render('index');
})

// Load up the Homepage - Form to Input
recordRoutes.route('/url').get(function(req, res) {
  res.render('form');
})

// On form submission
recordRoutes.route('/url').post(async function(req, res){

  let identifier
  if (req.body.identifier.length > 0 && req.body.identifier.length !== undefined) {
    identifier = req.body.identifier
  }
  else if (!req.body.identifier) {
    identifier = url.generateRandomIdentifier(5)
  }

  const db = dbo.getDb()
  const cursor = await db.collection("urls").find({ "url_identifier": identifier})

  const resultsArray = await cursor.toArray().then(results => {
    
    url.setOriginalUrl(req.body.originalurl)
    url.setIdentifier(identifier)
    let validUrl = url.validateInputUrl()
    console.log(validUrl)
  
      if (validUrl === true && results.length > 0) {
        console.log("valid but taken")
        res.render('form_resubmit');
      }  
      else if (validUrl !== true && results.length > 0) {
        console.log("url invalid")
        res.render('form_resubmit');
      }
      else if (validUrl !== true) {
        console.log("url invalid")
        res.render('form_resubmit');
      }
      else {
        url.addUrlToDb()
        res.send(`Thank you for submitting your URL to shorten! The URL you submitted is: ${req.body.originalurl} You can access your URL: Here: http://localhost:3000/identifier/${identifier}`)
      }
  })
})

// Get form re-submission
recordRoutes.route('/resubmit').get(function(req, res){
  console.log("form resubmitted")
  res.render('form_resubmit');
})

// Get form to delete a tinyURL
recordRoutes.route('/url_delete').get(function(req, res){
  res.render('form_delete');
})

// Post form to delete a tinyURL
recordRoutes.route('/url_delete').post(function(req, res){

  const tinyUrl = req.body.tinyurl
  const identifier = tinyUrl.split("/").pop()
  console.log(identifier)
  const db = dbo.getDb();
  db.collection("urls").deleteOne({"url_identifier": identifier})
  res.send(`Your tinyURL ${tinyUrl} has been successfully deleted and can be re-assigned`);
})

// Get a list of all the records.
recordRoutes.route("/urls").get(function (req, res) {
  let db_connect = dbo.getDb("urls_hub");
  db_connect
    .collection("urls")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      res.json(result);
    });
});

// Get a single record by the identifier
recordRoutes.route("/url/:identifier").get(async function (req, res) {
  const identifier = req.params.identifier
  const db = dbo.getDb()
  const cursor = await db.collection("urls").find({"url_identifier": identifier})
  const resultsArray = await cursor.toArray()
  res.json(resultsArray)
});

// Create a new record.
recordRoutes.route("/url/add").post(function (req, response) {
  const db = dbo.getDb();
  const myobj = {
    url_original: req.body.url_original,
    url_identifier: req.body.url_identifier,
    url_shortened: req.body.url_shortened,
  };
  db.collection("urls").insertOne(myobj, function (err, res) {
    if (err) throw err;
    response.json(res);
  });
});

// Update a record by id.
recordRoutes.route("/update/:id").post(function (req, response) {
  const db = dbo.getDb();
  const myquery = { _id: ObjectId( req.params.id )};
  const newvalues = {
    $set: {
        url_original: req.body.url_original,
        url_identifier: req.body.url_identifier,
        url_shortened: req.body.url_shortened,
    },
  };
  db
    .collection("urls")
    .updateOne(myquery, newvalues, function (err, res) {
      if (err) throw err;
      console.log("1 url updated");
      response.json(res);
    });
});

// Delete a record by id
recordRoutes.route("/:id").delete((req, response) => {
  const db = dbo.getDb();
  const myquery = { _id: ObjectId( req.params.id )};
  db.collection("urls").deleteOne(myquery, function (err, obj) {
    if (err) throw err;
    console.log("1 url deleted");
    response.status(obj);
  });
});

// Redirect by identifier
recordRoutes.route('/identifier/:identifier').get( async function(req, res) {
  const identifier = req.params.identifier
  const db = dbo.getDb()
  const cursor = await db.collection("urls").find({ "url_identifier": identifier})
  const resultsArray = await cursor.toArray()
  if (!resultsArray[0]) {
    res.send(`Your tinyUrl: http://localhost:3000/identifier/${identifier} doesnt seem to go anywhere!`)
  }
  else if (resultsArray[0].url_original) {
    res.redirect(resultsArray[0].url_original)
  }
  
})

module.exports = recordRoutes;