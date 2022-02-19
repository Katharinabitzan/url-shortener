const express = require("express");
const Url = require('../models/url.js');
const recordRoutes = express.Router();
const dbo = require("../db/conn");

// Help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// Load up the Homepage - Form to Input
recordRoutes.route('/').get(function(req, res) {
  console.log("rendering form now")
  res.render('form');
})

// Get form re-submission
recordRoutes.route('/resubmit/').get(function(req, res){
  console.log("form resubmitted")
  res.render('form_resubmit');
})

// On form submission
recordRoutes.route('/').post(function(req, res){

  let db = dbo.getDb()
  let cursor = db.collection("urls").find({ "url_identifier": req.body.identifier})

  const resultsArray = cursor.toArray().then(results => {
    console.log("results are: " + results)
    console.log("for each result print result: ")
    results.forEach(result => {
      console.log(result)
    })

    console.log("This will only print after the for each")

    const url = new Url(req.body.originalurl, req.body.identifier)
    let validUrl = url.validateInputUrl()
  
      if (validUrl == true && results.length > 0) {
        console.log(results.length)
        console.log(validUrl)
        console.log("identifier is: " + req.body.identifier)
        console.log("identifier is not unique, next step resubmit")
        res.render('form_resubmit');
      }  
      else if (validUrl != true && results.length > 0) {
        console.log(results.length)
        console.log(validUrl)
        console.log("identifier is not unique, and not valid")
        res.send(`Please enter a valid and unique URL !`)
      }
      else {
        console.log(results.length)
        console.log(validUrl)
        console.log("identifier is unique, aadding to DB")
        url.addUrlToDb()
        console.log("url added to db")
        res.send(`Thank you for submitting your URL to shorten! The URL you submitted is: ${req.body.originalurl} You can access your URL: Here: http://localhost:3000/identifier/${req.body.identifier}`)
      }
  })
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
recordRoutes.route('/identifier/:id').get( async function(req, res) {
  const identifier = req.params.id
  console.log("this is the identifier: " + identifier)
  console.log("Next step.. check if it exists in DB ")
 // res.send('This should redirect somewhere eventually IF that page is found')

 const db = dbo.getDb()
 const cursor = await db.collection("urls").find({ "url_identifier": identifier})
  const resultsArray = await cursor.toArray()
  res.redirect(resultsArray[0].url_original)

  
//  const resultsArray = cursor.toArray().then(results => {
//    console.log(`results are: ${JSON.stringify(results, null, 2)}`)
//    console.log("for each result print result: ")
//   //  results.forEach(result => {
//   //    console.log(result)
//   //    console.log(result.url_original)
//   //  })

//    console.log("This will only print after the for each, redirect after this")
//    console.log(results[0].url_original)
  
//   }).then(results => {
//     res.redirect(results[0].url_original)
//   })
})

module.exports = recordRoutes;