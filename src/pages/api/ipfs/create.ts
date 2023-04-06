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

  const getContent = async (cat: string) => {
    const data = concat(await all(client.cat(cat)))
    const decodedData = new TextDecoder().decode(data);
    console.log(decodedData)
    return
  };

  try {
    const added = await client.add(req.body);
    const url = `https://${process.env.IPFS_ENDPOINT}/api/v0/${added.path}`;

    getContent(added.path);
    res.status(200).json({ message: "Upload successful", location: url });
  } catch (error) {
    console.log("Error uploading file: ", error);
    return;
  }
}
