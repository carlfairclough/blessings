import buildVc from "@/utils/vc/buildVc";
import { ethers } from "ethers";
import { MongoClient, ServerApiVersion } from "mongodb";
import { blessingschema } from "@/utils/schemas/blessing";
import { NextApiRequest, NextApiResponse } from "next";
import { Address } from "wagmi";
import { useRouter } from "next/router";
import { SP } from "next/dist/shared/lib/utils";
import { Client, Events } from "discord.js";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { linkId } = JSON.parse(req.body);
  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const collection = client.db("discordLinks").collection("discordLinks");

    // Find all documents where the "expiry" field is less than or equal to the current date and time, and the "link" field matches the specified value
    const now = new Date();
    const links = await collection.find({ link: linkId }).toArray();

    const newLinks = links.filter((link) => {
      return now < link.expires;
    });

    if (newLinks.length === 1) {
      const token =
        "MTA5ODI1MzI0NTQ3NTk4MzQyMA.GTRVxb.5BLhpvT5Vjt0zAuLtIUgtOVFVQ31K_phCvfbA0";

      const client = new Client({ intents: [] });
      client.login(token);

      client.once(Events.ClientReady, async (c) => {
        const user = await client.users.fetch(newLinks[0].discordId);
        res.status(200).json({ valid: true, user: user });
      });
    } else {
      res.status(200).json({ valid: false });
    }
  } catch (err) {
    res.status(500);
  } finally {
    await client.close();
  }
}
