import { MongoClient, ServerApiVersion } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
/**
 * @swagger
 * /api/mongoDb/credentials/create:
 *   post:
 *     description: Posts a profile credential (TBD, validation)
 *     parameters:
 *      - in: header
 *        name: credential
 *        schema: 
 *          type: string,
 *          required: true,
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Failure
 */
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
    const collection = db.collection("public");

    // Insert a new document into the "public" collection
    const result = await collection.insertOne({ credential });
    console.log(`Inserted ${result} documents`);

    // Retrieve all documents from the "public" collection
    const movies = await collection.find({}).limit(10).toArray();
    client.close();
    res.json(movies);
  } catch (e) {
    console.error(e);
    res.status(500)
  }
};

export default handler