'use strict'; 
require('dotenv').config(); 
const express = require('express'); 
const myDB = require('./connection'); 
const { ObjectID } = require('mongodb');
const fccTesting = require('./freeCodeCamp/fcctesting.js');  
const session = require('express-session');
const passport =require('passport');

const app = express(); 
app.set('view engine', 'pug');   // Set the view engine to Pug
app.set('views'); 
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

myDB(async client =>{
  const myDataBase = await client.db('database').collection('users');

  // Be sure to change the title
  console.log("successful connection");
  app.route('/').get((req, res) => {
    // Change the response to render the Pug template
    // res.render('index', {
    //   title: 'Connected to Database',
    //   message: 'Please login'
    // });
    res.render('pug', { title: 'Connected to Database', message: 'Please login' });
  });
passport.serializeUser((user, done) => {
  done(null, user._id);
});

}).catch(e => {
  console.log("unsuccessful connection");
  app.route('/').get((req, res) => {
    res.render('pug', { title: e, message: 'Unable to connect to database' });
  });
});
passport.deserializeUser((id, done) => {
  myDB.findOne({ _id: new ObjectID(id) }, (err, doc) => {
    done(doc);
  });
});


fccTesting(app);  // For FCC testing purposes

app.use('/public', express.static(process.cwd() + '/public')); 
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));  

// app.route('/').get((req, res) => { 
//   res.render('index',
//      { title: 'Hello',
//        message: 'Please log in' 
//       });  
// });  

const PORT = process.env.PORT || 3000; 
app.listen(PORT, () => { 
  console.log('Listening on port ' + PORT); 
});
