const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');

// router.get('/fakeUser', async (req, res) => {
//     const user = new User({ email: 'abc@gmail.com', username: 'abc' })
//     const newUser = await User.register(user, 'abc123');
//     res.send(newUser)
// })
router.get('/register', async (req, res) => {
    res.render('auth/signup');
})
router.post('/register', async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            email: req.body.email,

        })
        const newUser = await User.register(user, req.body.password);
        req.flash('success', 'Registered Success');
        res.redirect('/products');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
});
// router.post('/login',
//     passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),

//     (req, res) => {
//         req.flash('success', `Welcome back ${req.user.username}`)
//         res.redirect('/products');
//     }
// )

router.get('/login', async (req, res) => {
    
    res.render('auth/login')
})

router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/login',
            failureFlash: true
        }
    ), (req, res) => {
        req.flash('success', `Welcome Back!! ${req.user.username}`)
        res.redirect('/products');
});
router.get('/logout', (req,res,next)=>{
    req.logout(function(err){
        if(err) 
        {
            return next(err)
        }
    
    req.flash('success', 'Logged out successfully');
    res.redirect('/login');
});
})
module.exports = router;