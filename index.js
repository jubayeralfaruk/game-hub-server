const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const port = process.env.PORT || 7000;

// Middleware
app.use(express.json());
app.use(cors());

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
      try {
        const email = req.query.email;
        const query = email ? { senderEmail: email } : {};
        const result = await gamesCollection.find(query).toArray();
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });


    app.post("/games", async (req, res) => {
      try {
        const game = req.body;
        const result = await gamesCollection.insertOne(game);
        res.status(201).json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });

    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("GameHub is ready...");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
