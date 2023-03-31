import Head from "next/head";
import Image from "next/image";
import { FC, useCallback, useEffect, useRef, useState } from "react";
import Airtable, { FieldSet, Records } from "airtable";
import { Address, useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage, useEnsName } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";
import { Blessing } from "@/components/blessing";
import { Blessings } from "@/components/blessings";
import { SendBlessing } from "@/components/sendBlessing";
import styled from "styled-components";

const StyledMain = styled.main({
  padding: 16,
  width: "100%",
  maxWidth: 600,
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  height: "100%",
  maxHeight: "100%",
  overflow: "hidden",
  "@media (max-width: 600px)": {
    padding: 0,
  },
});

const StyledTitle = styled.h1({
  fontSize: 32,

  padding: 16,
  margin: 0,
  "@media (max-width: 600px)": {
    fontSize: 24
  },
});

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
        setBlessing("");
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
  return (
    <>
      <Head>
        <title>🙏 blessed 🙏</title>
      </Head>
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          justifyContent: "center",
        }}
      >
        <StyledMain>
          <StyledTitle>🙏 blessed 🙏</StyledTitle>
          <Blessings blessings={blessings} />
          {loaded && (
            <SendBlessing
              isLoading={isLoading}
              blessing={blessing}
              setBlessing={setBlessing}
              sendBlessing={sendBlessing}
            />
          )}
        </StyledMain>
      </div>
    </>
  );
}
