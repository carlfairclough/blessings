import { create } from "ipfs-http-client";
import { NextApiRequest, NextApiResponse } from "next";

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
    console.log(req.body)
    const content = await client.cat('fileeee', req.body)
    console.log("file", content);
    res.status(200).json({ content: content });
  } catch (error) {
    console.log("Error feching file: ", error);
  }
}
