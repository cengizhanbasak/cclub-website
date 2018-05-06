var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var crypto = require('crypto');

var sqlite3 = require('sqlite3').verbose();
db = new sqlite3.Database('cclub.sqlite3', createTable);
function createTable() {
    db.run("CREATE TABLE IF NOT EXISTS  superUsers ( username varchar(25) NOT NULL, password TEXT NOT NULL);");
    db.run("CREATE TABLE IF NOT EXISTS active_members ( id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(30) NOT NULL, timestamp timestamp default current_timestamp);");
}

app.use(session({resave: true, saveUninitialized: true, secret: 'cblurbsecret', cookie: { maxAge: 60000 }}));
app.use( express.static(__dirname + '/public' , { maxage: '1d' }) );
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));


// GET REQUESTS

app.get('/*', function (req, res, next) {

  if (req.url.indexOf("/styles/") === 0 || req.url.indexOf("/img/") === 0) {
    res.setHeader("Cache-Control", "public, max-age=2592000");
    res.setHeader("Expires", new Date(Date.now() + 2592000000).toUTCString());
  }
  next();
});

app.get('/',function(req,res){
  req.session.name = "standard"
  res.setHeader("Cache-Control", "public, max-age=2592000");
  res.render('./src/index.ejs',{active:''});
});

// ADMIN STUFF

app.get('/admin',function(req,res){
  if(req.session.name == "superuser"){
    db.all("SELECT * FROM active_members",function(err,result) {
      res.render('./src/admin.ejs',{members: result})
    })
  }else {
    res.redirect('/')
  }
});

app.get('/admin/login',function(req,res){
  res.render('./src/adminLogin.ejs');
});

app.post('/admin/login',function(req,res){
  var username = req.body.username;
  var hashed = crypto.createHmac('sha256',req.body.password).digest('hex');
  console.log(hashed);
  db.serialize(function(){
    var stmt = db.prepare("SELECT EXISTS(SELECT * FROM superusers WHERE username=? )")
    stmt.get( username,function(err,result){
      if( result[Object.keys(result)[0]] == 1 ){
        db.get("SELECT * FROM superusers WHERE username=?", username, (err, res1) => {
          if( hashed == res1.password ){
            req.session.name = "superuser"
            res.redirect('/admin')
          }else {
            res.redirect('/')
          }
        })
      }else {
        res.redirect('/')
      }
    })
    stmt.finalize();
  })
});

app.get('/admin/logout',function(req,res){
  req.session.name = "standard"
  res.redirect('/')
});

// NEW MEMBER

app.get('/members/new',function(req,res){
  if(req.session.name == "superuser"){
    res.render('./src/members/new.ejs')
  }else {
    res.redirect('/')
  }
})

app.post('/members/new',function(req,res){
  if(req.session.name == "superuser"){
    var name = req.body.name
    if(name != '')
    db.run("INSERT INTO active_members ( name ) VALUES ( ? )", name,(err,result) => {
      res.redirect('/admin')
    })
  }else {
    res.redirect('/')
  }
})

// ADMIN STUFF END

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

app.get('/bilisimgunu',function(req,res){
  res.render('./src/bilisim.ejs',{active:'bilisim'});
});

app.get('/yarisma',function(req,res){
  res.status(301).redirect('https://yarisma.cclub.metu.edu.tr');
});

app.get('/bergi',function(req,res){
  res.status(301).redirect('https://e-bergi.com');
});

// NEW TAB SEEMS BETTER
// app.get('/tuzuk',function(req,res){
//   res.render('./src/tuzukPage.ejs',{active:'tuzuk'})
// });

// NOT AVAILABLE ROUTES
app.get('*',function(req,res){
  res.render("./src/errorPage.ejs",{active:''});
});


app.listen(3002,function(){
  console.log("Server started on port 3002");
});

process.on('exit', () => {
  db.close();
})
