const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.h60cu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
        const serviceCollection = client.db("warehouse").collection("warehouseService");
        // Get user from database(MongoDb)
        app.get('/inventory', async(req, res)=>{
            const query = {};
            const cursor = serviceCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })
        // Get single service data
        app.get('/inventory/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const service = await serviceCollection.findOne(query);
            res.send(service);
        })
    }
    finally{}
}
run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running warehouse inventory server');
});

app.listen(port, () => {
    console.log('Listening to the port', port);
})