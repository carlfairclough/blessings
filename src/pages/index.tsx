import Head from "next/head";
import Image from "next/image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Airtable, { FieldSet, Records } from "airtable";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";

export default function Home() {
  const [loaded, setLoaded] = useState<boolean>(false);
  const [blessing, setBlessing] = useState<string>("");
  const [blessings, setBlessings] = useState<Records<FieldSet> | undefined>();
  const { address, isConnected } = useAccount();
  const [blessingsTitle, setBlessingsTilte] = useState<string>(
    "Connect to send a blessing"
  );

  const recoveredAddress = useRef<string>();

  const { data, error, isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
      const response = await fetch("/api/postBlessing", {
        method: "POST",
        body: JSON.stringify({
          blessing: blessing,
          address: address,
          signature: data,
        }),
      });
      getBlessings().then((data) => {
        setBlessing('')
        setBlessings(data);
      });
      return response.json();
    },
  });

  const getBlessings = async () => {
    const response = await fetch("/api/getBlessings");
    return response.json();
  };

  const sendBlessing = async () => {
    signMessage({ message: blessing });
  };

  useEffect(() => {
    getBlessings().then((data) => {
      setBlessings(data);
    });
  }, []);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    }
  }, [loaded, setLoaded]);

  useEffect(() => {
    isConnected
      ? setBlessingsTilte("Send a blessing")
      : setBlessingsTilte("Connect to send a blessing");
  }, [isConnected, setBlessingsTilte]);

  const BlessingItem: FC<{ text: string; from: string; signature: string }> = ({
    text,
    from,
    signature,
  }) => (
    <div>
      <h5>From: {from}</h5>
      <p>{text}</p>
      <small>Signature: {signature}</small>
      <br />
      <br />
    </div>
  );

  return (
    <>
      <Head>
        <title>LDF&apos;s World</title>
      </Head>
      <main style={{ padding: 20 }}>
        <h1>Welcome to LDF&apos;s world</h1>
        <section>
          <br />
          <br />
          <>
            <h2>Leave me a blessing</h2>
            <br />
            {blessings?.map(
              (blessing, i) =>
                blessing._rawJson.fields.Blessing && (
                  <BlessingItem
                    key={i}
                    text={blessing._rawJson.fields.Blessing}
                    from={blessing._rawJson.fields.From}
                    signature={blessing._rawJson.fields.Signature}
                  />
                )
            )}
            <h3>{blessingsTitle}</h3>
            {isConnected && loaded && (
              <>
                <textarea
                  style={{ display: "block" }}
                  value={blessing}
                  onChange={(e) => setBlessing(e.target.value)}
                />
                <br />
                <button onClick={() => sendBlessing()}>Send Blessing</button>
              </>
            )}
            <br />
            <ConnectButton />
          </>
        </section>
      </main>
    </>
  );
}
