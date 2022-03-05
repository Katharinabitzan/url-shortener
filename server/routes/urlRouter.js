const express = require('express');
var router = express.Router();

// Load up the Small URL index page
router.get('/url', (req, res) => {
    connsole.log("url page")
    res.render('url/index');
});

module.exports = router;

