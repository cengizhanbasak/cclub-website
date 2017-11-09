var express = require('express');
var app = express();

app.use( express.static( "public" ) );

// GET REQUESTS

app.get('/',function(req,res){
  res.render('./src/index.ejs');
});




// NOT AVAILABLE ROUTES
app.get('*',function(req,res){
  res.render("./src/errorPage.ejs");
});


app.listen(8080,function(){
  console.log("Server started on port 8080");
});
