var express = require('express');
var router = express.Router();
var Shop = require('../models/shop');
var middleware = require('../middleware');
var NodeGeocoder = require('node-geocoder');

var options = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: process.env.GEOCODER_API_KEY,
    formatter: null
};

var geocoder = NodeGeocoder(options);

/* GET home page. */
router.get('/s', function(req, res, next) {
    res.render('shops');
});

// INDEX - Get all shops and show them on /shops
router.get('/', function (req, res) {
    // Get all shops from DB
    Shop.find({}, function(err, allShops){
        if (err){
            console.log(err);
        } else {
            // Populate all shops data to "shops" in rendered index.ejs
            res.render('shops/index', {shops: allShops});
        }
    })
});

// CREATE - Create a new shop and add it to DB
router.post('/', middleware.isLoggedIn, function (req, res) {
    // get data from new form and add to shops array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    geocoder.geocode(req.body.location, function(err, data){
        if (err || !data.length) {
           req.flash('error', 'Invalid address');
           return res.redirect('back');
        }

        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newShop = {name: name, price: price, image: image, description: desc, author: author, location: location, lat: lat, lng: lng};
        // create new shop and save it to DB
        Shop.create(newShop, function(err, newlyCreated){
            if (err) {
                console.log(err);
            } else {
                console.log(newlyCreated);
                res.redirect('/shops');
            }
        });
    });
});

// NEW - Show the create form to create new shop
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('shops/new');
})

// SHOW - Show detail of a shop (this needs to be after the other /shops/... as :id means anything)
router.get('/:id', function(req, res) {
    // find the shop with provided ID
    Shop.findById(req.params.id).populate('comments').exec(function(err, foundShop){
        if(err) {
            console.log(err);
        } else {
            console.log(foundShop);
            // render show template with that shop
            res.render('shops/show', {shop: foundShop});
        }
    });
});

// EDIT - Edit the shop route
router.get('/:id/edit', middleware.checkShopOwnership, function(req, res) {
    // is user logged in
    Shop.findById(req.params.id, function (err, foundShop) {
        res.render('shops/edit', {shop: foundShop});
    });
});

// UPDATE - Update the shop route
router.put('/:id', middleware.checkShopOwnership, function(req, res){
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        req.body.shop.lat = data[0].latitude;
        req.body.shop.lng = data[0].longitude;
        req.body.shop.location = data[0].formattedAddress;
        // find and update the correct shop
        Shop.findByIdAndUpdate(req.params.id, req.body.shop, function (err, updatedShop) {
            if (err) {
                req.flash('error', err.message);
                res.redirect('/shops');
            } else {
                req.flash('success', 'Successfully Updated!');
                res.redirect('/shops/' + req.params.id);
            }
        });
    });
});

// DESTROY - Delete the shop
router.delete('/:id', middleware.checkShopOwnership, function(req, res) {
    Shop.findByIdAndRemove(req.params.id, function(err){
        if (err) {
            res.redirect('/shops');
        } else {
            req.flash('success', 'Successfully deleted shop');
            res.redirect('/shops');
        }
    });
});

module.exports = router;
