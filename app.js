var express=require("express"),
	app=express(),
 	bodyParser=require("body-parser"),
	mongoose=require("mongoose"),
	passport=require("passport"),
	LocalStrategy=require("passport-local"),
	flash= require("connect-flash"),
	methodOverride=require("method-override"),
	Campground=require("./models/campground"),
	Comment= require("./models/comment"),
	User= require("./models/user");

var commentRoutes= require("./routes/comments"),
	campgroundRoutes= require("./routes/campgrounds"),
	indexRoutes = require("./routes/index");

var dbUrl=process.env.DB_URL || "mongodb://localhost/camp_in";
mongoose.connect(dbUrl, {
    useNewUrlParser: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+"/public")); 
app.use(methodOverride("_method"));
app.use(flash());
//==========================================================
//PASSPORT CONFIGURATION
//==========================================================
app.use(require("express-session")({
	secret:"Adding passport-local for authentication",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser= req.user;
	res.locals.error=req.flash("error");
	res.locals.success=req.flash("success");
	
	next(); 
});
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, function(){
	console.log("Server started at", PORT);
});