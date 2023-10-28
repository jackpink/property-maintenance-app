
import { MongoClient, ServerApiVersion, UpdateFilter } from 'mongodb';
import {env} from '../../../env.mjs';

const uri = env.MONGODB_URI;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
export const mongoClient = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const dbName = env.MONGODB_DB;


export async function updateJobHistory(update: UpdateFilter<Document>, jobId: string) {
    try {
        await mongoClient.connect();
        const jobsCol = mongoClient.db(dbName).collection("jobs")
        const query = { id: jobId };
        const options = { upsert: true };
        const col = await jobsCol.updateOne(query, update, options); 
        console.log("Updated notes on MongoDB", col);
        
    } finally {
        await mongoClient.close();
    }
}


export async function getJobHistory(jobId: string) {
    try {
        await mongoClient.connect();
        const jobsCol = mongoClient.db(dbName).collection("jobs")
        const query = { id: jobId };
        const col = await jobsCol.findOne(query); 
        console.log("Got Job histopry from MongoDB", col);
        return col;
    } finally {
        await mongoClient.close();
    }
}

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoClient.connect();
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoClient.close();
  }
}
run().catch(console.dir);
