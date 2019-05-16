var express = require('express');
var router = express.Router({mergeParams: true});
var Shop = require('../models/shop');
var Comment = require('../models/comment');
var middleware = require('../middleware');

// GET New Comment form
router.get('/new', middleware.isLoggedIn, function(req, res){
    // find shop by ID
    Shop.findById(req.params.id, function (err, shop) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/new', {shop: shop});
        }
    });
});

// CREATE - Create new comment
router.post('/', middleware.isLoggedIn, function (req, res) {
    // lookup shop by ID
    Shop.findById(req.params.id, function(err, shop) {
        if (err) {
            console.log(err);
            res.redirect('/shops');
        } else {
            // create new comment
            Comment.create(req.body.comment, function(err, comment){
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log(err);
                } else {
                    // add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    // save comment
                    comment.save();
                    // connect new comment to shop
                    shop.comments.push(comment);
                    shop.save();
                    // redirect to /shops/:id
                    req.flash("success", "Successfully added comment");
                    res.redirect('/shops/' + shop._id);
                }
            });
        }
    });
});

// EDIT - Edit the comment route
router.get('/:comment_id/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        } else {
            res.render('comments/edit', {shop_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE - Update the comment route
router.put('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Successfully updated comment");
            res.redirect("/shops/" + req.params.id);
        }
    });
});

// DESTROY - Delete the comment route
router.delete('/:comment_id', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if (err) {
            res.redirect("back");
        } else {
            req.flash("success", "Successfully deleted comment");
            res.redirect("/shops/" + req.params.id);
        }
    });
});

module.exports = router;