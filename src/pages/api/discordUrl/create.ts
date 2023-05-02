import buildVc from "@/utils/vc/buildVc";
import { ethers } from "ethers";
import { MongoClient, ServerApiVersion } from "mongodb";
import { blessingschema } from "@/utils/schemas/blessing";
import { NextApiRequest, NextApiResponse } from "next";
import { Address } from "wagmi";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  
  const { discordId } = JSON.parse(req.body);

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const db = client.db("discordLinks");
    const collection = db.collection("discordLinks");

    const currentTime= Date.now()
    const expires = new Date(currentTime + 600000);

    // Insert a new document into the "public" collection
   const link = Math.random().toString(36).slice(2)
    
    const result = await collection.insertOne({ expires:  expires, discordId: discordId, link: link});
    // Retrieve all documents from the "public" collection
    client.close();
    res.status(200).json({link: `http://localhost:3000/?linkdiscord=${link}`});
  } catch (err) {
    console.error('500 error');
    res.status(500)
  }
}



