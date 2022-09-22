const isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash('error', 'You should Log In first');
        res.redirect('/login');
    }
    next();
}
module.exports={isLoggedIn}
