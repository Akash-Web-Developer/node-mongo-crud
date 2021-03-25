const express = require('express');
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;



//From Connect with Application
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://organicUser:electricity!!!@cluster0.tthev.mongodb.net/organicdb?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})



//Connect with your Application

client.connect(err => {
    const productCollection = client.db("organicdb").collection("products");

    // Create Api 
    app.get('/products', (req, res) => {
        productCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })


    //Single Product Loading
    app.get('/product/:id', (req, res) => {
        productCollection.find({ _id: ObjectId(req.params.id) })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productCollection.insertOne(product)
            .then(result => {
                console.log("Data Added Successfully");
                res.redirect('/')
            })
    })


    // app.patch('/update/:id', (req, res) => {
    //     console.log(req.body);
    //     console.log(req.params.id);
    //     productCollection.updateOne({ _id: ObjectId(req.params.id) },
    //         {
    //             $set: { price: req.body.price, quantity: req.quantity.price }
    //         }
    //     )
    //     .then(result => {
    //         // console.log(result);
    //     })
    // })


    //from meet

    app.patch('/update/:id', (req, res) => {
        productCollection.updateOne({_id: ObjectId(req.params.id)},
        {
          $set: {price: req.body.price, quantity: req.body.quantity}
        })
        .then (result => {
          res.send(result.modifiedCount > 0)
        })
      })


    app.delete('/delete/:id', (req, res) => {
        console.log(req.params.id);
        productCollection.deleteOne({ _id: ObjectId(req.params.id) })
            .then(result => {
                res.send(result.deletedCount > 0);
            })
    })

    console.log("Hello Database")
});






app.listen(3000);