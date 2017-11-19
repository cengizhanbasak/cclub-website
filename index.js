var express = require('express');
var app = express();

app.use( express.static( "public" ) );

// GET REQUESTS

app.get('/',function(req,res){
  res.render('./src/index.ejs');
});

app.get('/announce',function(req,res){
  res.render('./src/announce.ejs');
});

app.get('/about',function(req,res){
  res.render('./src/about.ejs');
});

app.get('/contact',function(req,res){
  res.render('./src/contact.ejs');
});

app.get('/events',function(req,res){
  res.render('./src/eventsPage.ejs');
});

// NOT AVAILABLE ROUTES
app.get('*',function(req,res){
  res.render("./src/errorPage.ejs");
});


app.listen(3002,function(){
  console.log("Server started on port 3002");
});
