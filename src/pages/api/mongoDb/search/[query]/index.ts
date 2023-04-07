import { MongoClient, ServerApiVersion } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const routerLegacy = useRouterLegacy();

  const { query } = req.query;
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const db = client.db("credentials");
    const profiles = await db
      .collection("profiles")
      .aggregate([
        // Match documents that match the search criteria
        {
          $match: {
            $or: [
              { "credential.name": { $regex: query, $options: "i" } },
              {
                "credential.credentialSubject.id": {
                  $regex: query,
                  $options: "i",
                },
              },
              { "credential.issuer.id": { $regex: query, $options: "i" } },
            ],
            "credential.type": { $in: ["BioCredential"] },
          },
        },
        // Group by credential.credentialSubject.id, and get the latest credential
        {
          $group: {
            _id: "$credential.credentialSubject.id",
            credential: { $last: "$credential" },
          },
        },
      ])
      .toArray();

    const links = await db
      .collection("links")
      .aggregate([
        {
          $match: {
            $or: [
              {
                "credential.credentialSubject.id": {
                  $regex: query,
                  $options: "i",
                },
              },
              { "credential.issuer.id": { $regex: query, $options: "i" } },
              { "credential.handle": { $regex: query, $options: "i" } },
            ],
            "credential.type": { $in: ["AccountLinkCredential"] },
          },
        },
        {
          $group: {
            _id: {
              handle: "$credential.handle",
              id: "$credential.credentialSubject.id",
            },
            latest: { $max: "$_id" },
            doc: { $last: "$$ROOT" },
          },
        },
        {
          $replaceRoot: { newRoot: "$doc" },
        },
      ])
      .toArray();

    client.close();
    res.status(200).json({ profiles: profiles, links: links });
  } catch (e) {
    console.error(e);
    res.status(500)
  }
};

export default handler