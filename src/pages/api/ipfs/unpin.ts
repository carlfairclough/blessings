import { create } from "ipfs-http-client";
import { NextApiRequest, NextApiResponse } from "next";
import all from "it-all";
import { concat } from "uint8arrays";

const projectId = process.env.IPFS_ID;
const projectSecret = process.env.IPFS_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const client = create({
    host: process.env.IPFS_ENDPOINT,
    port: 5001,
    protocol: "https",
    apiPath: "/api/v0",
    headers: {
      authorization: auth,
    },
  });

  try {
    await client.pin.rm(req.body)
    res.status(200).json({ message: "Unpin successful"});
  } catch (error) {
    console.log("Error unpinning", error);
    return;
  }
}
