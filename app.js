var express = require("express"),
commentRoutes    = require("./routes/comments"),
reviewRoutes     = require("./routes/reviews"),
campgroundRoutes = require("./routes/campgrounds"),
indexRoutes      = require("./routes/index"),
app = express(),
bodyParser = require("body-parser"),
mongoose = require("mongoose"),
passport = require("passport"),
LocalStrategy = require("passport-local"),
methodOverride = require("method-override"),
Campground = require("./models/campground"),
flash = require("connect-flash"),

User = require("./models/user"),
seedDB = require("./seeds"),
Comment = require("./models/comment");

//requiring routes
var commentRoutes = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index")


// seedDB(); //seed the database
app.use(flash());


var url = process.env.DATABASEURL || "mongodb://localhost:27017/yelp_camp_3"
mongoose.connect(url);

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//eliminates the need to add .ejs on routes
app.set("view engine", "ejs");
    
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret:"Once again Rusty wins",
    resave: false, 
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error= req.flash("error");
    res.locals.success= req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("YelpCamp Has Started");
});

