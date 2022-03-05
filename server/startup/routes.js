const express = require("express");
const path = require('path');
const indexRouter = require("../routes/indexRouter");
const urlRouter = require("../routes/urlRouter");

module.exports = function(app) {
    app.use(express.json());
    app.use("/url", urlRouter);
    app.use("/", indexRouter);

    // View Engine Setup
    app.set('views', path.join(__dirname, '../../public/views'));
    app.set('view engine', 'ejs');
    app.use(express.static(__dirname + '../../public/views'));
    app.use(express.urlencoded({
        extended: true
    }));    
};

