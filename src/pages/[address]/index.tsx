import { useRouter } from "next/router";
import { Suspense, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { Address } from "@wagmi/core";
import { Flex, Button, Box, useToast, Grid } from "@chakra-ui/react";

import { SendGm } from "@/components/sendGm";
import { fetchEnsAddress } from "@wagmi/core";
import { Vcs } from "@/components/gms";
import Link from "next/link";
import ProfileCard from "@/components/profileCard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { blessingschema } from "@/utils/schemas/blessing";
import { SendCred } from "@/components/sendCred";

function Profile({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const toast = useToast();
  const [refresh, setRefresh] = useState<number>(0);

  // Wagmi proxy
  const { address: userAddress, isConnected } = useAccount();
  const [_isConnected, _setIsConnected] = useState(false);
  const [_userAddress, _setUserAddress] = useState<Address | undefined>(
    undefined
  );
  useEffect(() => {
    _setIsConnected(isConnected);
    _setUserAddress(userAddress);
  }, [isConnected]);

  // Account data
  const { profile, address, ensName, links } = data;

  // Logged in user address
  const path = router.query.address as string;

  // Account VCs
  const [mongoVcs, setMongoVcs] = useState<any[]>([]);

  useEffect(() => {
    setMongoVcs([]);
    const mongoData = async (address: string) => {
      const response: any = await fetch(
        `/api/mongoDb/credentials/get/${address}`
      );
      const r = await response.json();
      if (r) {
        console.log("setting mongo vcs");
        setMongoVcs(r);
      } else {
        setMongoVcs([]);
      }
    };
    address && mongoData(address);
  }, [address, path, refresh, setMongoVcs]);

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/mongoDb/credentials/delete`, {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    }).then((res) => {
      console.log(res);
      toast({
        title: `deleted ☹️`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setRefresh(refresh + 1);
      return res;
    });
  };

  return (
    <Flex width="full" justifyContent="center" p="4">
      <Grid
        w="full"
        maxW="container.xl"
        gridTemplateColumns={{ base: "1fr", md: "1fr 1fr 1fr 1fr" }}
        gridColumnGap={"16"}
        gridRowGap={"16"}
      >
        <Grid
          as="header"
          gridTemplateColumns="repeat(auto-fill, minmax(240px, 1fr))"
          gridColumnGap={"16"}
          gridRowGap="4"
          gridColumnStart={0}
          gridColumnEnd={0}
          height="fit-content"
        >
          {address && (
            <ProfileCard
              displayName={profile?.name || ensName || address}
              bio={profile?.bio}
              address={address as Address}
              image={profile?.image}
            />
          )}
          <Flex flexDirection={"column"}>
            <Suspense fallback={<p>Loading connection state...</p>}>
              {_isConnected && (
                <>
                  <SendGm
                    colorScheme="yellow"
                    recipient={address}
                    my={4}
                    onSend={() => setRefresh(refresh + 1)}
                  />
                  <SendCred
                    customLabel={"🙏 bless 🙏"}
                    schema={blessingschema}
                    colorScheme="teal"
                    recipient={address}
                    successText={
                      (profile?.name || ensName || address) + " blessed 🕊"
                    }
                    mb={4}
                    onSend={() => setRefresh(refresh + 1)}
                  />
                </>
              )}
            </Suspense>
            {address == _userAddress && (
              <Link href={address + "/manage"}>
                <Button w="100%">Manage my profile</Button>
              </Link>
            )}
          </Flex>
        </Grid>
        <Grid
          height="fit-content"
          gridColumnStart={{ base: 1, md: 2 }}
          gridColumnEnd={{ base: 1, md: 5 }}
          gridTemplateColumns="repeat(auto-fill, minmax(240px, 1fr))"
          gridColumnGap={{ base: 4, md: 8 }}
          gridRowGap={{ base: 4, md: 8 }}
          w="full"
          pb={50}
        >
          {mongoVcs && (
            <Vcs
              credentials={[...mongoVcs]}
              handleDelete={handleDelete}
              onSend={() => setRefresh(refresh + 1)}
              userAddress={userAddress}
            />
          )}
        </Grid>
      </Grid>
    </Flex>
  );
}

export default Profile;

type Data = {
  address: Address;
  ensName: `${string}.eth` | null;
  profile: any | null;
  links: any[] | null;
};

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async ({
  query: { address },
  req: { headers },
}) => {
  let data: Data = {
    address: address as Address,
    ensName: null,
    profile: null,
    links: null,
  };

  const proto = headers["x-forwarded-proto"];

  const a = address as string;

  if (a?.endsWith(".eth")) {
    try {
      const addr = await fetchEnsAddress({
        name: address as string,
      });
      data.address = (await addr) || (address as Address);
      data.ensName = address as `${string}.eth`;
    } catch (err) {
      // 404
    }
  } else {
    data.address = address as Address;
  }

  const getProfile = async () => {
    try {
      const response: any = await fetch(
        `http://${headers.host}/api/mongoDb/credentials/get/${data.address}/profile`
      );
      let r = await response.json();
      return r.credential;
    } catch (err) {
      console.warn("profile error", err);
    }
  };
  const profile = await getProfile();

  const getLinks = async () => {
    const response: any = await fetch(
      `http://${headers.host}/api/mongoDb/credentials/get/${data.address}/accountLinks`
    );
    const r = await response.json();
    if (r) {
      return r.map((l: any) => l.credential);
    }
    return null;
  };
  const links = await getLinks();

  data.profile = profile || null;
  data.links = links || null;

  console.log(await data);

  return {
    props: {
      data,
    },
  };
};
