import { MongoClient, ServerApiVersion } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { recipient, credential, signature } = JSON.parse(req.body);
  const uri = `mongodb+srv://blessed:eA8jdYjp36GAJxtg@$credentials.fy5dzyy.mongodb.net/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const db = client.db("credentials");
    const collection = db.collection("profiles");

    // Insert a new document into the "public" collection
    const result = await collection.insertOne({ credential });

    // Retrieve all documents from the "public" collection
    // const movies = await collection.find({}).limit(10).toArray();
    console.log("saved profile");
    client.close();
    res.status(200);
  } catch (e) {
    console.error(e);
    res.status(500)
  }
};

export default handler