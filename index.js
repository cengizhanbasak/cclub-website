var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');


const { Client } = require('pg')
const client = new Client({
  user: 'cclub',
  host: '/var/run/postgresql',
  database: 'cclub',
  password: '',
  port: 5432,
})
client.connect()


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
    client.query("SELECT * FROM active_members",(err,result) => {
      res.render('./src/admin.ejs',{members: result.rows})
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
  var password = req.body.password;

  client.query("SELECT EXISTS(SELECT * FROM superusers WHERE username='"+ username +"')",(err,result) => {
    console.log(result.rows[0].exists)
    if( result.rows[0].exists == true ){
      client.query("SELECT * FROM superusers WHERE username='"+ username +"'", (err, res1) => {
        if( password == res1.rows[0].password ){
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
});

app.get('/admin/logout',function(req,res){
  req.session.name = "standard"
  res.redirect('/')
});

// NEW MEMBER

app.get('/members/new',function(req,res){
  if(req.session.name == "standard"){
    res.render('./src/members/new.ejs')
  }else {
    res.redirect('/')
  }
})

app.post('/members/new',function(req,res){
  if(req.session.name == "standard"){
    var name = req.body.name
    if(name != '')
    client.query("INSERT INTO active_members ( name ) VALUES ( '" + name + "' )",(err,result) => {
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
