const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectId  = require('mongodb').ObjectID;
const app = express()
const cors = require('cors');
const fs = require('fs-extra');
const bodyParser = require('body-parser');
require('dotenv').config()

const port = process.env.PORT || 5500;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Welcome to Plumbing Masters Backend')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hwouc.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const adminsCollection = client.db("plumbing-masters").collection("admins");
  const orders = client.db("plumbing-masters").collection("orders");
  const services = client.db("plumbing-masters").collection("services");
  const reviews = client.db("plumbing-masters").collection("reviews");
  console.log("Data base connected");


  app.post("/adminUpload",(req,res)=>{

    const newAdmin = req.body;
    adminsCollection.insertOne(newAdmin)
    .then(result => {
      res.send(result.insertedCount > 0)
      res.redirect("/")
    })
  
  })
  app.post("/servicesUpload",(req,res)=>{

    const newService = req.body;
    services.insertOne(newService)
    .then(result => {
      res.send(result.insertedCount > 0)
      res.redirect("/")
    })
  
  })
  app.post("/reviewsUpload",(req,res)=>{

    const newReviews = req.body;
    reviews.insertOne(newReviews)
    .then(result => {
      res.send(result.insertedCount > 0)
      res.redirect("/")
    })
  
  })
  
  app.get("/showreviews", (req,res)=>{
    reviews.find()
    .toArray((err, service)=>{
      res.send(service)
    })
  })


  app.get("/showservices", (req,res)=>{
    services.find()
    .toArray((err, service)=>{
      res.send(service)
    })
  })

  app.get("/showadmins", (req,res)=>{
    adminsCollection.find()
    .toArray((err, admins)=>{
      res.send(admins)
    })
  })
  app.post("/addorder",(req,res)=>{

    const order = req.body;
    orders.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
    })
  
  })
  app.get("/showorders", (req,res)=>{
    orders.find()
    .toArray((err, items)=>{
      res.send(items)
    })
  })

  app.get('/updateorder/:id',(req,res) =>{

    orders.find({_id: ObjectId(req.params.id)})
    .toArray((err, order)=>{
      res.send(order)
    })
  })

  app.delete('/delete/:id',(req,res) =>{

    services.deleteOne({_id: ObjectId(req.params.id)})
    .then(result => {
      console.log(result);
      
    })
  })
  


  // client.close();
});


app.listen(process.env.PORT || port)