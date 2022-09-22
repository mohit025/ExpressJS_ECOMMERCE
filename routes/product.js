const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');


// Display all the products
router.get('/products', async (req, res) => {
    try {

        const products = await Product.find({});

        res.render('products/index', { products });
    }
    catch (e) {
        console.log("something is wrong");
        req.flash('error', "cannot find products")
        res.render('error');
    }
})


// Get the form for new product
router.get('/products/new',isLoggedIn, (req, res) => {

    res.render('products/new');
})
// router.post('/products', isLoggedIn,async (req, res) => {
//     try {
//         await Product.create(req.body.product);
//         req.flash('success', 'Product Created Successfully');
//         res.redirect('/products');
//     }
//     catch (e) {
//         console.log(e.message);
//         req.flash('error', 'Cannot Create Products,Something is Wrong');
//         res.render('error');
//     } 
// })


// Create New Product
router.post('/products', isLoggedIn, async (req, res) => {
    try {

        await Product.create(req.body.product);
        req.flash('success', 'Product created successfully');

        res.redirect('/products');
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot create this Product, Something is wrong');
        res.render('error');

    }

});


// Show particular product
router.get('/products/:id', async (req, res) => {
    try {

        const product = await Product.findById(req.params.id).populate('reviews');
        res.render('products/show', { product });
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot find this Product');
        res.redirect('/error');
    }
})

// Get the edit form
router.get('/products/:id/edit', isLoggedIn, async (req, res) => {

    const product = await Product.findById(req.params.id);

    res.render('products/edit', { product });
})

// Upadate the particular product
router.patch('/products/:id', isLoggedIn, async (req, res) => {

    await Product.findByIdAndUpdate(req.params.id, req.body.product);
    req.flash('success', 'Product Updated Successfully');
    res.redirect(`/products/${req.params.id}`)
})


// Delete a particular product
router.delete('/products/:id', isLoggedIn, async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products');
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot delete this product');
        res.redirect('/error');
    }
})




// Creating a New Comment on a Product

router.post('/products/:id/review', isLoggedIn, async (req, res) => {
    try {


        const product = await Product.findById(req.params.id);
        const review = new Review({
            user: req.user.username,
            ...req.body
        });


        

        product.reviews.push(review);

        await review.save();
        await product.save();

        req.flash('success','Successfully added your review!')
        res.redirect(`/products/${req.params.id}`);
    }
    catch (e) {

        console.log(e.message);
        req.flash('error', 'Cannot add review to this product');
        res.redirect('/error');
    }
});

router.get('/error', (req, res) => {
    res.render('error');
})

module.exports = router;