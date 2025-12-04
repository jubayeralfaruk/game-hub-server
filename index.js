const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 5000;

//middleware
app.use(express.json());
app.use(cors());
// 629UtoeMxwMLrWNM

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzgjhab.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    const db = client.db("game_hub_db");
    const gamesCollection = db.collection("games");

    app.get("/games", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.senderEmail = email;
      }
      const result = await gamesCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/games", async (req, res) => {
      const parcel = req.body;
      const result = gamesCollection.insertOne(parcel);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

// respond with "hello world" when a GET request is made to the homepage
app.get("/", (req, res) => {
  res.send("Zap is shifting shifting");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
