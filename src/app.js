// require modules
const express = require('express');
const app = express();
const pug = require('pug');
const fs = require('fs')
const Sequelize = require ('sequelize');
const pg = require ('pg');
const bodyParser = require('body-parser')
var session = require ('express-session');
var Promise = require ('promise');


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
  password: Sequelize.STRING
});

var Info = sequelize.define('info', {
	city: Sequelize.TEXT,
	country: Sequelize.TEXT,
	age: Sequelize.INTEGER,
	gender: Sequelize.TEXT,
	mainInstrument: Sequelize.TEXT,
	otherInstrument: Sequelize.TEXT,
	gear: Sequelize.TEXT,
	lookingFor: Sequelize.TEXT,
	description: Sequelize.TEXT
});

var Message = sequelize.define('message', {
	title: Sequelize.TEXT,
	body: Sequelize.TEXT
});

var Comment = sequelize.define('comment', {
	title: Sequelize.TEXT,
	body: Sequelize.TEXT
})

//Set database structure
User.hasMany(Message);
Message.belongsTo(User);
Info.belongsTo(User);
Comment.belonsTo(User);
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
//get navbar for each page
app.get('/nav2..pug', function ( req, res ){
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
	console.log(req.body.email)
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
  console.log(user)
  if ( user === undefined){
    res.redirect('/?message=' + encodeURIComponent("Please log in to view your profile."));
  } 
 else {
 	User.findAll({
 		where:{
 			id: req.session.user.id
 		}
 	}).then(function(profile){
 		res.render('profile',{
 			usertje: user,
 			sessionuser: user,
 			created: req.session.user.updatedAt
 		});
 	});
    console.log(req.session.user.updatedAt)
};
});

app.get('/logout', (req, res)=> {
  console.log('User is logged out')
  req.session.destroy(function(error){
    if(error){
      throw error;
    }
    res.redirect('/?/message=' + encodeURIComponent("Succesfully logged out!"));
  });
});





sequelize.sync({force: false}).then(function () {
var server = app.listen(3000, function () {
		console.log('Example app listening on port: ' + server.address().port);
	});
});