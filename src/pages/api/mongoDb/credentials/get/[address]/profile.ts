import { MongoClient, ServerApiVersion } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const routerLegacy = useRouterLegacy();

  const { address } = req.query;
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const db = client.db("credentials");
    const creds = await db
      .collection("profiles")
      .find({
        "credential.credentialSubject.id": address,
        "credential.type": { $in: ["BioCredential"] },
      })
      .sort({ _id: -1 })
      .limit(1)
      .toArray();
    client.close();
    res.status(200).json(creds[0]);
  } catch (e) {
    console.error(e);
    res.status(500)
  }
};

export default handler