// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Airtable, { FieldSet, Records } from "airtable";

Airtable.configure({
  apiKey: process.env.AIRTABLE_KEY as string,
});

const base = Airtable.base(process.env.AIRTABLE_BASE as string);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { blessing, address, signature } = JSON.parse(req.body);
  base("Received").create(
    [
      {
        //@ts-ignore
        fields: {
          fldc5uvPzUhm65M8a: blessing,
          fldGUC4OjNASsWZBk: address,
          fld96ACYZ1GWtI8FZ: signature,
        },
      },
    ],
    function (err: any, records: Records<FieldSet>) {
      if (err) {
        res.status(500).json({ message: "Error when saving blessing" });
        return;
      }
      res.status(200).json({message: "You have blessed LDF"});
    }
  );
}
