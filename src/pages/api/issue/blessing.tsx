import buildVc from "@/utils/vc/buildVc";
import { ethers } from "ethers";
import { MongoClient, ServerApiVersion } from "mongodb";
import { blessedAccountLinkSchema } from "@/utils/schemas/blessedAccountLinkSchema";
import { NextApiRequest, NextApiResponse } from "next";
import { Address } from "wagmi";
import { blessingschema } from "@/utils/schemas/blessing";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { recipient } = JSON.parse(req.body);

  const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@${process.env.MONGODB_URI}/?retryWrites=true&w=majority`;

  const client = new MongoClient(uri, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    const wallet = new ethers.Wallet(process.env.PRI_KEY as string);

    const newData = {
      id: recipient,
    };

    const payload = buildVc(
      wallet.address as Address,
      newData,
      blessingschema,
      recipient as string
    );

    const signature = await wallet.signMessage(JSON.stringify(payload));

    const signedVc = {
      ...payload,
      proof: {
        type: "ethereumSign",
        signature: signature,
      },
    };

    const credResponse = await fetch(
      "http://localhost:3000/api/mongoDb/credentials/create",
      {
        method: "POST",
        body: JSON.stringify({
          credential: signedVc,
          recipient: recipient,
          signature: signature,
        }),
      }
    );
    client.close();
    res.status(200).json({ message: "Credential successfully issued" });
  } catch (err) {
    console.error("500 error");
    res.status(500);
  }
}
