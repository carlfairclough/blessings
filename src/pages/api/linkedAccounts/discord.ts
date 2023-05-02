import { MongoClient, ServerApiVersion } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const routerLegacy = useRouterLegacy();

  const { userId } = JSON.parse(req.body);
  console.log(userId);
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
      .collection("public")
      .aggregate([
        {
          $match: {
            "credential.credentialSubject.platformId": userId,
            "credential.credentialSubject.platform": "Discord",
            "credential.type": { $in: ["BlessedAccountLink"] },
          },
        },
        {
          $sort: { "credential.issuanceDate": -1 },
        },
        {
          $group: {
            _id: {
              handle: "$credential.credentialSubject.platformId",
              platform: "$credential.credentialSubject.platform",
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
    if (links.length) {
      console.log(links)
      res.status(200).json({ isUser: true, link: links[0].credential, _id: links[0]._id });
    } else {
      res.status(200).json({ isUser: false, link: false });
    }
  } catch (e) {
    res.status(500);
  }
};

export default handler;
