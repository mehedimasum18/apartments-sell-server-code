const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const ObjectId = require("mongodb").ObjectId;
const port = process.env.PORT || 5000;
const { MongoClient, Admin } = require("mongodb");

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vukhj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    await client.connect();
    const apartmentsServicesCollection = client.db("sweet_home").collection("apartment_services");
    const apartmentOrderCollection = client.db("sweet_home").collection("apartment_orders");
    const reviewsCollection = client.db("sweet_home").collection("reviews");
    const adminCollection = client.db("sweet_home").collection("admin");
  
    //get apartment services 
    app.get("/apartmentsServices", async (req, res) => {
      const result = await apartmentsServicesCollection.find({}).toArray();
      res.json(result);
    });

    // get apartment service from id 
    app.get("/apartmentsServices/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await apartmentsServicesCollection.findOne(filter);
      res.json(result);
    });
    
    //delete apartment service item 
    app.delete("/apartmentsServices/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await apartmentsServicesCollection.deleteOne(filter);
      res.json(result);
    });
    
    //post apartment collection data in database
    app.post("/orders", async (req, res) => {
      const cursor = req.body;
      const result = await apartmentOrderCollection.insertOne(cursor);
      res.json(result);
    });
    
    //get my order data from database
    app.get("/orders", async (req, res) => {
      const result = await apartmentOrderCollection.find({}).toArray();
      res.json(result);
    });
    
    //delete order items 
    app.delete("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const cursor = { _id: ObjectId(id) };
      const result = await apartmentOrderCollection.deleteOne(cursor);
      res.json(result);
      
    });
    
    //update status 
    app.put("/orders/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const status = req.body.status;
      const options = { upset: true }
      const updateDoc = {
        $set: {
          status: "Shipped"
        }
      }
      const result = await apartmentOrderCollection.updateOne(filter, updateDoc, options)
      console.log(result);
      res.json(result);
    });
    
    // add new service in database 
    app.post("/addProduct", async (req, res) => {
      const cursor = req.body;
      const result = await apartmentsServicesCollection.insertOne(cursor);
      res.json(result);
      
    });
    
    //post all admin collection
    app.post("/admin", async (req, res) => {
      const cursor = req.body;
      const admin = await adminCollection.insertOne(cursor);
      res.json(admin);
    });
    
    // get all admin data 
    app.get("/admin", async (req, res) => {
      const adminData = await adminCollection.find({}).toArray();
      console.log(adminData);
      res.json(adminData);
    });
    
    // set review at data in database 
    app.post("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.insertOne(review);
      res.json(result);
    });
    
    //get review data from database 
    app.get("/review", async (req, res) => {
      const review = req.body;
      const result = await reviewsCollection.find(review).toArray();
      res.json(result);
    });
      
  } catch {
    // await client.close();
  }
  
}

run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Running crud");
});

app.listen(port, () => {
  console.log("Running card server on port", port);
});
