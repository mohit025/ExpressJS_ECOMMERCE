const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
// const seedDB = require('./seed');
const productRoutes=require('./routes/product');
const methodOverride = require('method-override');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const authRoutes=require('./routes/auth');


mongoose.connect('mongodb://localhost:27017/shopApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("DB connected");
})
.catch((err)=>{
    console.log("ERROR"); console.log(err);
});
const sessionConfig=({
    secret: 'bettersecreat',
    resave: false,
    saveUninitialized: true,
    
  })
  app.use(session(sessionConfig));
  app.use(flash());

  app.use(passport.initialize());
  app.use(passport.session());
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error');
    res.locals.currentUser=req.user;
    next();
  })
//  seedDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'))

app.use(productRoutes);
app.use(authRoutes);
app.get('/', (req, res) => {
    
    res.send("LANDING PAGE");
})




app.listen(3000, () => {
    console.log("Server Started AT PORT 3000");
})