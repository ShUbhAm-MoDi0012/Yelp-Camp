var express    =require("express"),
	router     =express.Router(),
	Campground =require("../models/campground"),
	middleware =require("../middleware");

router.get("/",function(req,res){
	Campground.find({},function(err,allCampgrounds){
		if(err)
			console.log(err)
		else
			{
				res.render("campgrounds/index",{campgrounds:allCampgrounds,/*currentUser:req.user*/page:"campgrounds"});
			}
	});
});

router.post("/",middleware.isLoggedIn,function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var description=req.body.description;
	var price=req.body.price;
	var author={
		id:req.user._id,
		username:req.user.username
	}
	var newCampground={name:name,title:image,description:description,author:author,price:price};
	Campground.create(newCampground,function(err,newlycreated){
		if(err)
			console.log(err);
		else
			res.redirect("/campgrounds");
	});
});

router.get("/new",middleware.isLoggedIn,function(req,res){
	res.render("campgrounds/new");
});

router.get("/:id",function(req,res){
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
		if(err || !foundCampground){
			req.flash("error","Campground not found");
			res.redirect("back");
		}
		else{
				res.render("campgrounds/show",{campground:foundCampground});
			}
	});
});

//=======
//EDIT & UPDATE
//=======

router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
		Campground.findById(req.params.id,function(err,foundCampground){
			res.render("campgrounds/edit",{campground:foundCampground});	
	});
});

router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
	Campground.findByIdAndUpdate(req.params.id , req.body.campground , function(err,updatedCampground){
		if(err)
			console.log(err);
		else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});

//=======
//DELETE
//=======

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
Campground.findByIdAndRemove(req.params.id,function(err){
	if(err)
		console.log(err);
	else{
		req.flash("success","Campground deleted");
		res.redirect("/campgrounds");
	}
		
});	
});

module.exports=router;