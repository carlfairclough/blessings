import { MongoClient, ServerApiVersion } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = JSON.parse(req.body);
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });
  console.log(id)
  if (!id) {
    console.error('No id supplied')
    res.status(400).json({ message: "No credential ID supplied" });
  }

  try {
    await client.connect();
    const db = client.db("credentials");
    const creds = await db
      .collection("public")
      .deleteOne({ "credential.id": id });
    client.close();
    res.status(200).json(creds);
  } catch (e) {
    console.error(e);
    res.status(500)
  }
};

export default handler