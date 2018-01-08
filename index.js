var express = require('express');
var app = express();
app.use( express.static(__dirname + '/public' , { maxage: '1d' }) );
var active;


// GET REQUESTS

app.get('/*', function (req, res, next) {

  if (req.url.indexOf("/images/") === 0 || req.url.indexOf("/stylesheets/") === 0) {
    res.setHeader("Cache-Control", "public, max-age=2592000");
    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
  }
  next();
});

app.get('/',function(req,res){
  res.setHeader("Cache-Control", "public, max-age=2592000");
  res.render('./src/index.ejs',{active:''});
});

app.get('/announce',function(req,res){
  res.render('./src/announce.ejs',{active:'announce'});
});

app.get('/about',function(req,res){
  res.render('./src/about.ejs',{active:'about'});
});

app.get('/contact',function(req,res){
  res.render('./src/contact.ejs',{active:'contact'});
});

app.get('/events',function(req,res){
  res.render('./src/eventsPage.ejs',{active:'events'});
});

app.get('/gallery',function(req,res){
  res.render('./src/gallery.ejs',{active:'gallery'});
});

// NOT AVAILABLE ROUTES
app.get('*',function(req,res){
  res.render("./src/errorPage.ejs",{active:''});
});


app.listen(3002,function(){
  console.log("Server started on port 3002");
});
