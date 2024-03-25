const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const cors = require('cors')
const app = express()
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DBUSER}:${process.env.DBPASS}@cluster0.kdlxq0n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");


        // code write here 
        const database = client.db("burger-week");
        const posterCollection = database.collection("poster-image-text");
        const popularProductCollection = database.collection("popular-product")

        // all post api write here 

        // poster upload api 
        app.post('/poster', async(req, res) => {
            const newPoster = req.body;
            console.log(newPoster);
            const result = await posterCollection.insertOne(newPoster);
            res.send(result);
        });

        // popular post upload api 
        app.post('/popularProduct', async(req, res) => {
            const popularProduct = req.body;
            console.log(popularProduct);
            const result = await popularProductCollection.insertOne(popularProduct);
            res.send(result);
        });



        // all get post write here 

        // get api for poster 
        app.get('/poster', async(req, res) => {
            const getPoster = posterCollection.find();
            const result = await getPoster.toArray();
            res.send(result);
        });

        app.get('/popularProduct', async(req, res) => {
            const getPopularProduct = popularProductCollection.find();
            const result = await getPopularProduct.toArray();
            res.send(result);
        })



    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Burger Week Server Running!')
})

app.listen(port, () => {
    console.log(`Express Server Running On Port ${port}`)
})