var crypto = require('crypto');
var sqlite3 = require('sqlite3').verbose();

db = new sqlite3.Database('cclub.sqlite3');
db.run("CREATE TABLE IF NOT EXISTS superusers ( username varchar(25) NOT NULL UNIQUE, password TEXT NOT NULL);");
db.run("CREATE TABLE IF NOT EXISTS active_members ( id INTEGER PRIMARY KEY AUTOINCREMENT, name varchar(30) NOT NULL, timestamp timestamp default current_timestamp);");

function usage(){
    console.log("usage:", process.argv[0], process.argv[1], "[username] [passwd]");
    process.exit(1);
}

if(process.argv.length != 4) usage();

u = process.argv[2];
h = crypto.pbkdf2Sync(process.argv[3], "cblurb", 100000, 64, "sha512").toString("hex");
db.run("INSERT INTO superusers (username, password) VALUES (?, ?);", u, h);
console.log("OK")

process.on('exit', () => {
  db.close();
})
