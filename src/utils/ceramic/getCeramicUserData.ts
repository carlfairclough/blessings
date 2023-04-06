import { CeramicClient } from "@ceramicnetwork/http-client";
import { TileDocument } from "@ceramicnetwork/stream-tile";


async function getCeramicUserData(did: string, ceramicClient: CeramicClient): Promise<any> {
  const doc = await TileDocument.deterministic<"blesssed-sent">(
    ceramicClient,
    {
      controllers: [did],
      family: "blessed-sent",
    },
    { syncTimeoutSeconds: 5 },
  );

  return doc.content;
}

export default getCeramicUserData