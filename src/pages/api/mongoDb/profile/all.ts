import { MongoClient, ServerApiVersion } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const db = client.db("credentials");

    const profiles = await db
      .collection("profiles")
      .aggregate([
        {
          $sort: { "credential.issuanceDate": -1 },
        },
        {
          $group: {
            _id: {
              issuer: "$credential.issuer",
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

    res.status(200).json(profiles);
  } catch (e) {
    console.error(e);
  }
};
