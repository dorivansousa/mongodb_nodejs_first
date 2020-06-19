const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { Logger, ObjectID } = require('mongodb');
const mongoClient = require('mongodb').MongoClient;

const dotEnv = require('dotenv');
dotEnv.config();
const uriMongoClient = process.env.URI;

mongoClient.connect(uriMongoClient, (err, client) => {
    if (err) return console.log(err);
    db = client.db('crud-nodejs');

    app.listen(3000, () => {
        console.log('Servidor Online 2')
    })  
});

app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    var cursor = db.collection('data').find();    
    db.collection('data').find().toArray((err, results) => {
    if (err) return console.log(err);
    
    res.render('index.ejs', {data: results})
  })
});

app.get('/editar/:id', (req, res) => {
  let id = req.params.id;

  db.collection('data').find(ObjectID(id)).toArray((err, results) =>{
    if (err) return res.sender(err);

    console.log(results);
    res.render('editar.ejs', {data: results});    
  });
});

app.post('/editar/:id', (req, res) => {
    let id = req.params.id;
    let name = req.body.name;
    let surname = req.body.surname;
    console.log(req.body);
    db.collection('data').updateOne({_id: ObjectID(id)} , 
      {$set: 
        {
            name: name,
            surname: surname
        }
      }, (err, results) =>{
      if (err) return res.sender(err);
  
      res.redirect('/');    
    });  
}); 

app.get('/apagar/:id', (req, res) => {
    let id = req.params.id;

    console.log("Apagando Registro " + id);    
    db.collection('data').deleteOne({_id: ObjectID(id)} , 
      (err, results) =>{
        if (err) return res.sender(err);

        res.redirect('/');
    });
});

app.get('/novo', (req, res) => {
  res.render('novo.ejs');
});

app.post('/grava', (req, res) => {
  db.collection('data').save(req.body, (err, result) => {
    if (err) return res.sender(err);
    
    console.log(req.body);
    res.redirect('/');
  });
  
  
});


