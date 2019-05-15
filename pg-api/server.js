let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let pg = require('pg');
const PORT = 3000;
const uuidv4 = require('uuid/v4');

let pool = new pg.Pool({
    port: 5432,
    password: 'admin',
    database: 'postgres',
    max:10,
    host: 'localhost',
    user: 'postgres'
});



let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.use(morgan('dev'));

app.use(function(request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  
app.post('/api/new-user', function(request, response) {
var User_Name = request.body.User_Name;
var User_Level = request.body.User_Level;
var User_Uuid = uuidv4();

 pool.connect((err, db, done) =>{
     if(err)
     {return response.status(400).send(err);}
     else
     {
         //"table" variable in following line is probably the result returned by running the query
         db.query('INSERT INTO TestUsers (UName, ULevel, Uuid) VALUES ($1,$2,$3)',[User_Name, User_Level, User_Uuid], (err, table)=>{
             if(err) {
                 return response.status(400).send(err);
             }
             else
             {
                 console.log("Data Inserted");
                // console.log("UUID is: " + uuidv1());
                 db.end();
		         response.status(201).send({message:"Data Inserted!"});
             }
         })
     }
 })
});


app.post('/api/del-user', function(request, response) {
    var User_Name = request.body.User_Name;
    
     pool.connect((err, db, done) =>{
         if(err)
         {return response.status(400).send(err);}
         else
         {
             //"table" variable in following line is probably the result returned by running the query
             db.query('delete from testusers where uname = $1',[User_Name], (err, table)=>{
                 if(err) {
                     return response.status(400).send(err);
                 }
                 else
                 {
                    console.log(table);
                     db.end();
                     response.status(201).send({message:"Data Deleted!"});
                 }
             })
         }
     })
    });






  app.listen(PORT, () => console.log('Listening on port ' + PORT));