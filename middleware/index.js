var Shop = require('../models/shop');
var Comment = require('../models/comment');
// All middleware are placed here
var middlewareObj = {};

middlewareObj.checkShopOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Shop.findById(req.params.id, function(err, foundShop){
            if (err) {
                req.flash("error", "Shop not found");
                console.log(err);
            } else {
                // does the user own/create the shop
                if(foundShop.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if (err) {
                res.redirect("back");
            } else {
                // does the user own/create the comment
                if(foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
            }
        });
    } else {
        req.flash("error", "You need to be logged in");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next) {
    if (req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in");
    res.redirect('/login');
}


module.exports = middlewareObj;