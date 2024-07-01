var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var dot_env = require("dotenv");
var moment = require("moment");
const rateLimit = require('express-rate-limit');

dot_env.config();
var apiRouter = require("./routes/api/Main");
var app = express();

if (process.env.MODE !== "dev"){
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
        message: 'Too many requests from this IP, please try again later.',
    });
    app.use(limiter);
}

// view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.disable('etag'); // for disable node If-None-Match comparing 

// app.get('*', function(req, res) {
//     res.render('maintenance');
// });

app.use("/api", apiRouter);

if (process.env.MODE !== "dev"){
    const BUILD_PATH = path.join(__dirname, "../front-end/dist");
    app.use(express.static(BUILD_PATH));
    app.get("*", (req, res) => {
        res.sendFile(path.join(BUILD_PATH, "index.html"));
    });
}

//404 handler
app.use(function(req, res, next) {
    return res.status(404).json({
        status: "error",
        message: "Not found",
    });
});


//500 handler
app.use(function(err, req, res, next) {
    try{
        console.error(err,`
            Request: ${req.method} ${req.url}
            Headers: ${JSON.stringify(req.headers)}
            Body: ${JSON.stringify(req.body)}
            Timestamp: ${moment().utc().format("YYYY-MM-DD HH:mm:ss")}
        `);
    }catch(error){
        console.log("500 handler error", error, err);
    }

    return res.status(err.status || 500).json({
        status: "error",
        message: "Internal server error",
    });
});


module.exports = app;