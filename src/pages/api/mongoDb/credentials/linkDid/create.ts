import { MongoClient, ServerApiVersion } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const { recipient, credential, signature } = JSON.parse(req.body);
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const db = client.db("credentials");
    const collection = db.collection("linkedDids");

    // Insert a new document into the "public" collection
    const result = await collection.insertOne({ credential });
    client.close();
    res.json(result);
  } catch (e) {
    console.error(e);
    res.status(500)
  }
};

export default handler