import { Box, Button, Card, Grid, Heading, Text, useToast } from "@chakra-ui/react";
import { Address, Connector, useAccount } from "wagmi";
import { FC, useEffect, useState } from "react";

import { EthereumAuthProvider, ThreeIdConnect } from "@3id/connect";
import { getResolver as get3IDResolver } from "@ceramicnetwork/3id-did-resolver";
import { CeramicClient } from "@ceramicnetwork/http-client";
import { DID } from "dids";
import IVC from "@/types/IVC";
import { didLinkSchema } from "@/utils/schemas/didLink";
import { SendCred } from "./sendCred";
import buildVc from "@/utils/vc/buildVc";

const CeramicConnect: FC<{ linkedDids?: any[], onComplete: () => void }> = ({ linkedDids, onComplete }) => {
  const { address, isConnected, connector } = useAccount();
  const [_address, _setAddress] = useState<Address | undefined>(undefined);
  const [_connector, _setConnector] = useState<Connector | undefined>(
    undefined
  );
  const [_provider, _setProvider] = useState<any>(undefined);
  const [refresh, setRefresh] = useState<number>(0);

  // const [vc, setVc] = useState<IVC | null>(null);
  const toast = useToast();

  // const [ceramicConnected, setCeramicConnected] = useState(false)
  const [did, setDid] = useState<any>(undefined);
  const [did3, setDid3] = useState<string | undefined>(undefined);

  useEffect(() => {
    const getProvider = async () => {
      try {
        const prov = await connector?.getProvider();
        _setProvider(await prov);
      } catch (err) {
        _setProvider(undefined);
        console.error(err);
      }
    };
    if (isConnected) {
      _setAddress(address);
      _setConnector(connector);
      getProvider();
    }
  }, [address, connector, isConnected, _setProvider]);

  const connect = async (address: any, provider: any) => {
    const authProvider = new EthereumAuthProvider(provider, address as string);
    const threeIdConnect = new ThreeIdConnect('mainnet');
    await threeIdConnect.connect(authProvider);
    // console.log('api endpoint', process.env.NEXT_PUBLIC_CERAMIC_API)
    const ceramic = new CeramicClient(process.env.NEXT_PUBLIC_CERAMIC_API);
    const did = new DID({
      provider: threeIdConnect.getDidProvider(),
      resolver: get3IDResolver(ceramic),
    });
    await did.authenticate();
    setDid(did);
    console.log(did);
    setDid3(did.id);

    try {
      await threeIdConnect.connect(authProvider);
      console.log(threeIdConnect.accountId);
    } catch (err) {
      console.error(err);
    }
  };

  const sign = async () => {
    if (did3) {
      console.log('signing')
      const vc = await buildVc(did3, { id: address }, didLinkSchema, address);
      const link = await did.createJWS(vc);

      const response = await fetch("/api/mongoDb/linkDid/create", {
        method: "POST",
        body: JSON.stringify({
          credential: { ...vc, signature: link.signatures[0].signature },
          recipient: address,
          signature: link.signatures[0].signature,
        }),
      });
      console.log('signed')

      console.log(response)

      toast({
        title: "Account link successfully created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      
      onComplete()

      return response.json();
    }
    
  };

  if (_address && _provider) {
    return (
      <Card
        flexWrap="wrap"
        justifyContent="space-between"
        w="full"
        height="fit-content"
        gridColumnStart={{ base: 1, lg: 2 }}
        gridColumnEnd={{ base: 1, lg: 4 }}
        background={"blackAlpha.300"}
        boxSizing="border-box"
      >
        <Heading
          size="md"
          as="h2"
          py={4}
          px={8}
          borderBottom={"1px"}
          borderBottomColor={"whiteAlpha.200"}
          color="GrayText"
          boxSizing="border-box"
        >
          Link DID:3 (Ceramic)
        </Heading>

        <Box px={8} py={8} boxSizing="border-box">
          {linkedDids && (
            <Grid overflow={"hidden"} mb={4}>
              {linkedDids.map((link: any, i: any) => (
                <Card p={4} w="full" key={i} maxW="full">
                  <Text>{link.credential.issuer.id}</Text>
                </Card>
              ))}
            </Grid>
          )}
          <Text as="p">
            DID:3 and DID:PKH are insecure, as they leak the private keys to
            control your DID to the browser. A malicious website can harvest
            these keys to take complete control of DIDs in the future. We
            recommend linking any of these DIDs here, and then{" "}
            <b>never using those identity tools again</b>.
          </Text>
          <Heading as="h3" size="sm" mt="4" mb="2">
            1. Authenticate using the Ceramic Modal
          </Heading>
          <Button onClick={(e) => connect(_address, _provider)} disabled>
            {!did ? "Authenticate With Ceramic" : "Authenticated"}
          </Button>
          {did && (
            <>
              <Heading as="h3" size="sm" mt="4" mb="2">
                2. Issue yourself a credential from your DID:3 address
              </Heading>
              <Button onClick={(e) => sign()}>Sign</Button>
            </>
          )}
        </Box>
      </Card>
    );
  } else return <></>;
};

export default CeramicConnect;
