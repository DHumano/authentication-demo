var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose")

mongoose.connect("mongodb://localhost/auth");



var app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require("express-session")({
    secret: "dario es un capo programando",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//ROUTES
app.get("/", function (req, res) {
    res.render("home");
});


app.get("/secret", isLoggedIn, function (req, res) {
    res.render("secret");
});



//AUTH ROUTES

//SHOW SIGN UP FORM
app.get("/register", function (req, res) {
    res.render("register");

});

//maneja USER SIGN UP
app.post("/register", function (req, res) {

    User.register(new User({ username: req.body.username }), req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render("register");
        } else {
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secret");
            });
        }
    });
});

//login ROUTES

app.get("/login", function (req, res) {
    res.render("login");
});

//middleware
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"
}), function (req, res) {

});

app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); //NO OLVIDAR PARENTESIS ACA
    }//no necesito else porque tengo el return arriba
    res.redirect("/login");

}

app.listen(process.env.PORT || 3000, function () {
    console.log("server started");
});





// npm install --save express ejs request body-parser mongoose method-override express-sanitizer  
//npm install --save express ejs body-parser mongoose passport passport-local passport-local-mongoose express-session 