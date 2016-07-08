// require modules
const express = require('express');
const app = express();
const pug = require('pug');
const fs = require('fs')
const Sequelize = require ('sequelize');
const pg = require ('pg');
const bodyParser = require('body-parser')
const session = require ('express-session');
const Promise = require ('promise');
const sass = require('node-sass');
const moment = require('moment');

//Set sass files
sass.render({
  file: 'resources/style/scss/mystyle.scss',
}, function(err, result) { 
  console.log(err, result)
  fs.writeFile( 'resources/style/style.css', result.css.toString(), (err) =>{
    if (err) throw err
      console.log('Sass written to css')
  });
 });


//set view engine and views
app.set('views', 'src/views');
app.set('view engine', 'pug');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('./resources/'));
app.use(express.static('./semantic/'));

//connect to database blog_app
var sequelize = new Sequelize ('musicmeet', 'postgres' , 'kyle1993' ,{
  host: 'localhost',
  dialect: 'postgres',
});

//start session
app.use (session({
    secret: 'secret secret',
    resave: true,
    saveUninitialized: false
}));



//Creating a new table called users
var User = sequelize.define('user', {
  userName: Sequelize.STRING,
  email: Sequelize.STRING,
  password: Sequelize.STRING,
  city: Sequelize.TEXT,
  country: Sequelize.TEXT,
  age: Sequelize.INTEGER,
  gender: Sequelize.TEXT,
  mainInstrument: Sequelize.TEXT,
  otherInstrument: Sequelize.TEXT,
  gear: Sequelize.TEXT,
  lookingFor: Sequelize.TEXT,
  description: Sequelize.TEXT,
  genre: Sequelize.TEXT,
  
  });

var Message = sequelize.define('message', {
	title: Sequelize.TEXT,
	body: Sequelize.TEXT
});

var Comment = sequelize.define('comment', {
	body: Sequelize.TEXT
})

//Set database structure
User.hasMany(Message);
Message.belongsTo(User);
Comment.belongsTo(User);
Message.hasMany(Comment);
Comment.belongsTo(Message);
User.hasMany(Comment);


//display index page
app.get('/', function ( req, res ){
  console.log('Index is displayed on localhost');
	res.render('index');
});


//get navbar for each page
app.get('/navbar.pug', function ( req, res ){
  console.log('Index is displayed on localhost');
	res.render('navbar');
});

//verify logindata user
app.post('/login', function ( req, res ) {
  if (req.body.loginEmail.length === 0){
		res.redirect('/?message=' + encodeURIComponent(("Please fill out your username.")));
		return;
	}
	if (req.body.loginPassword.length === 0){
		res.redirect('/?message=' + encodeURIComponent(("Please fill out your password.")));
		return;
	}
  User.findOne({
    where: {
          email : req.body.loginEmail
        }
  }).then(function (user){
    if ( user !== null && req.body.loginPassword === user.password){
      req.session.user = user;
      console.log(user.id)
      res.redirect('/profile');
    } else {
      res.redirect ('newUser')
      console.log('nope no user found with that combination')

    }
  })

})

// display registration page
app.get('/newuser', function ( req, res ){
  console.log('Registration page is displayed on localhost');
	res.render('newUser');
});

// push user info to database
app.post('/register', function( req, res ){
  User.create({
    userName: req.body.username,
    email: req.body.email,
    password: req.body.password
  }).then(function(){
    res.redirect('/');
});
});


app.get('/profile', function(req, res){
  var user = req.session.user;
  
  if ( user === undefined){
    res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
  } 
 else {
 	User.findAll({
 		where:{
 			id: req.session.user.id
 		},include: [
    { model: Message }]
 	}).then(function(profile){
    // res.send(profile[0])
    // var user = profile.map((user)=>{
    //   var time = user.dataValues.createdAt
    //   return {
    //     id: user.dataValues.id,
    //     username: user.dataValues.userName,
    //     email: user.dataValues.email,
    //     password: user.dataValues.password,
    //     city: user.dataValues.city,
    //     country: user.dataValues.country,
    //     age: user.dataValues.age,
    //     gender: user.dataValues.gender,
    //     mainInstrument: user.dataValues.mainInstrument,
    //     otherInstrument: user.dataValues.otherInstrument,
    //     gear: user.dataValues.gear,
    //     lookingFor: user.dataValues.lookingFor,
    //     description: user.dataValues.description,
    //     genre: user.dataValues.genre,
    //     time: moment(time).format('MMM Do YY'),
    //     email: user.dataValues.email,
    //     messages: user.dataValues.messages
    //   }
    res.render('profile',{
      user: profile[0]
     })
    })
 		 
    // res.send(profile)
    console.log('HOI')
 		};
 	
    
});


//display info
app.get('/info', function ( req, res ){
  var user = req.session.user;
  console.log(user)
  if ( user === undefined){
    res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
  } else{
  console.log('Index is displayed on localhost');
  res.render('info');
};

app.post('/addInfo', function ( req, res){
    User.findOne({
    where:{
      id: req.session.user.id
    }
  }).then(function(User){
      console.log(User)
    User.updateAttributes({
      city: req.body.city,
      country: req.body.country,
      age: req.body.age,
      gender: req.body.gender,
      mainInstrument: req.body.mainInstrument,
      otherInstrument: req.body.otherInstrument,
      gear: req.body.gear,
      lookingFor: req.body.lookingFor,
      description: req.body.description,
      genre: req.body.genre
      }).then(function(){
        res.redirect('profile');
            })
 });

})
});

//display Message
app.get('/message', function ( req, res ){
  var user = req.session.user;
  console.log(user)
  if ( user === undefined){
    res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
  } else{
  console.log('Index is displayed on localhost');
  res.render('message');
};

app.post('/addmessage', function ( req, res){
    User.findOne({
    where:{
      id: req.session.user.id
    }
  }).then(function(User){
      console.log(User)
    User.createMessage({
      title: req.body.title,
      body: req.body.body
      }).then(function(){
        res.redirect('profile');
            })
 });

})
});

app.get('/logout', (req, res)=> {
  console.log('User is logged out')
  req.session.destroy(function(error){
    if(error){
      throw error;
    }else{ 
      res.render('index')
    }
    
  });
});





sequelize.sync({force: false}).then(function () {
var server = app.listen(4000, function () {
		console.log('Example app listening on port: ' + server.address().port);
	});
});