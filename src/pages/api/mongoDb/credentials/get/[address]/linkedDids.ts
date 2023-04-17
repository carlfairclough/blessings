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
    const links = await db
      .collection("linkedDids")
      .aggregate([
        {
          $match: {
            "credential.credentialSubject.id": address,
            "credential.type": { $in: ["DidLinkCredential"] },
          },
        },
        {
          $sort: { "credential.issuanceDate": -1 },
        },
        {
          $group: {
            _id: {
              id: "$credential.did",
            },
            latestLink: { $first: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$latestLink" },
        },
      ])
      .toArray();
    client.close();
    res.status(200).json(links);
  } catch (e) {
    res.status(500)
  }
};

export default handler;
