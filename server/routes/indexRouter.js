const express = require('express');
var router = express.Router();

// Load up the Homepage
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;


