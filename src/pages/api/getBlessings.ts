// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Airtable, { FieldSet, Records } from "airtable";

Airtable.configure({
  apiKey: process.env.AIRTABLE_KEY as string,
});

const base = Airtable.base(process.env.AIRTABLE_BASE as string);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Records<FieldSet> | any>
) {
  await base(process.env.AIRTABLE_TITLE as string)
    .select({
      view: "Grid view",
    })
    .firstPage(function (err, records) {
      if (err) {
        return res.status(500).json({message: 'Needs an exorcism'})
      }
      return res.status(200).json(records as Records<FieldSet>);
    });
}
