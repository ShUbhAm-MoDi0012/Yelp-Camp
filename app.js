var express        = require("express"),
    app            = express(),
    bodyParser     = require("body-parser"),
    mongoose       = require("mongoose"),
	flash          = require("connect-flash"),
	passport       = require("passport"),
	LocalStrategy  = require("passport-local"),
	methodOverride = require("method-override"),
    Campground     = require("./models/campground"),
	Comment        = require("./models/comment"),
	User           = require("./models/user"),
	seedDB         = require("./seeds");

var commentRoutes     =require("./routes/comments"),
	campgroundRoutes  =require("./routes/campgrounds"),
	indexRoutes       =require("./routes/index");

mongoose.connect("mongodb+srv://dbuser:papamummy@2532314@blogsite.ztinz.mongodb.net/dbuser?retryWrites=true&w=majority",{useNewUrlParser: true,useCreateIndex: true});
// "mongodb://localhost:27017/yelp_camp"
// "mongodb+srv://dbuser:papamummy@2532314@yelpcamp.ztinz.mongodb.net/dbuser?retryWrites=true&w=majority"
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();   //sedd the database

app.use(require("express-session")({
	secret:"aman is chutiya",
	resave:false,
   saveUninitialized:false	
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	next();
});

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/", indexRoutes);


app.listen(process.env.PORT,process.env.IP,function(){
	console.log("ALL IS WELL");
});