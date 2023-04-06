import { ConnectButton } from "@rainbow-me/rainbowkit";
import useSWR from "swr";
import { useRouter } from "next/router";
import { FC, Key, useCallback, useEffect, useState } from "react";
import { useAccount, useEnsName } from "wagmi";
import { Address, Provider } from "@wagmi/core";
import {
  Flex,
  Heading,
  Button,
  Box,
  Avatar,
  useToast,
  Tag,
  Text,
} from "@chakra-ui/react";

import { SendGm } from "@/components/sendGm";
import { fetchEnsAddress } from "@wagmi/core";
import { Gm } from "@/components/gm";
import { Vcs } from "@/components/gms";
import Link from "next/link";
import ProfileCard from "@/components/profileCard";
import Nav from "@/components/nav";
import { TNameStatus } from "@/components/nameStatusTag";
import { phishingNames } from "@/utils/lists/phishingNames";
import Head from "next/head";
import TwitterPreviewCard from "@/components/twitterPreviewCard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

function Profile ({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  // const routerLegacy = useRouterLegacy();
  const path = router.query.address as string;
  console.log(path);
  const [name, setName] = useState<string | undefined>(data.profile.credential);
  const [ensName, setEnsName] = useState<string | undefined>();
  const [nameStatus, setNameStatus] = useState<TNameStatus>();
  const [address, setAddress] = useState<Address | undefined>();
  const [err, setErr] = useState<boolean>(false);
  const toast = useToast();
  const { connector, address: userAddress, isConnected } = useAccount();
  const [isLoaded, setIsLoaded] = useState<boolean>(true);
  const [refresh, setRefresh] = useState<number>(0);

  const [profile, setProfile] = useState<any>({});

  const { data: ens } = useEnsName({ address: userAddress });
  const a = ens != null ? ens : userAddress;

  const [mongoVcs, setMongoVcs] = useState<any[]>([]);
  const [links, setLinks] = useState<any[] | undefined>([]);

  const getAddress = async (ens: string) => {
    const add: Address | undefined | null = await fetchEnsAddress({
      name: ens,
    });
    await add;
    if (await add) {
      setEnsName(ens);
      setAddress((await add) as Address);
    } else {
      setName(undefined);
      setErr(true);
    }
    return;
  };

  useEffect(() => {
    if (path?.slice(-4) == ".eth") {
      getAddress(path);
    } else {
      setAddress(path as Address);
    }
  }, [path]);



  useEffect(() => {
    const mongoData = async (address: string) => {
      const response: any = await fetch(
        `/api/mongoDb/credentials/get/${address}`
      );
      const r = await response.json();
      if (r) {
        console.log("setting mongo vcs");
        console.log(r);
        setMongoVcs(r);
      } else {
        setMongoVcs([]);
      }
    };
    address && mongoData(address);
  }, [address, path, refresh, setMongoVcs]);

  useEffect(() => {
    userAddress && isConnected && setIsLoaded(true);
  }, [userAddress, isConnected]);

  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/mongoDb/credentials/delete`, {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
    }).then((res) => {
      console.log(res);
      toast({
        title: `GM deleted ☹️`,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setRefresh(refresh + 1);
      return res;
    });

    console.log(response);
  };

  useEffect(() => {
    const links = async () => {
      const response: any = await fetch(
        `/api/mongoDb/credentials/get/${address}/accountLinks`
      );
      const r = await response.json();
      if (r) {
        console.log("setting account links");
        console.log(r);
        setLinks(r);
      } else {
        setLinks(r);
      }
    };
    if (address) {
      links();
    }
  }, [address, setLinks, refresh]);

  // Set Name
  useEffect(() => {
    const profile = async (address: string) => {
      try {
        const response: any = await fetch(
          `/api/mongoDb/credentials/get/${address}/profile`
        );
        let r = await response.json();
        if (r) {
          setProfile(r.credential);
        }
      } catch (err) {
        setProfile(undefined);
        console.warn("profile error", err);
      }
    };
    if (address) {
      profile(address);
    }
  }, [address]);


  return (
    <>
      <Head>
        <TwitterPreviewCard handle={profile?.links && profile.links[0]?.handle} displayName={profile.name || address} bio={profile?.bio} />
      </Head>
      <Flex width="full" justifyContent="center" p="4">
        <Box width="full" maxWidth="container.xl">
          {/* <SignIn /> */}

          <Flex as="header" w="full" alignItems={"flex-start"}>
            <Box mr={12}>
              {isLoaded && address && (
                <ProfileCard
                  displayName={profile?.name || ensName || address}
                  bio={profile?.bio}
                  address={address as Address}
                  image={profile?.image}
                />
              )}
              <Flex flexDirection={"column"}>
                {isLoaded && address && isConnected && !err && (
                  <SendGm
                    colorScheme="yellow"
                    recipient={address}
                    my={4}
                    onSend={() => setRefresh(refresh + 1)}
                  />
                )}
                {isLoaded && address == userAddress && isConnected && !err && (
                  <Link href={address + "/manage"}>
                    <Button w="100%">Manage my profile</Button>
                  </Link>
                )}
              </Flex>
            </Box>
            <Flex flexWrap="wrap" justifyContent="space-between" w="full">
              {isLoaded && mongoVcs && (
                <Vcs
                  credentials={[...mongoVcs]}
                  handleDelete={handleDelete}
                  onSend={() => setRefresh(refresh + 1)}
                  userAddress={userAddress}
                />
              )}
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};

export default Profile;

type Data = {
  address: string,
  profile: any,
  credentials: any,
  links: any,
}

export const getServerSideProps: GetServerSideProps<{ data: Data }> = async ( {query: {address}}) => {
  const getCredentials = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/mongoDb/credentials/get/${address}`
  );
  const credentials = await getCredentials.json();
  
  const getProfile = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/mongoDb/credentials/get/${address}/profile`
  );
  const profile = await getProfile.json();

  const getLinks = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/mongoDb/credentials/get/${address}/accountLinks`
  );
  const links = await getLinks.json();

  const data: Data = await {
    address: address as string,
    credentials: credentials,
    profile: profile,
    links: links,
  } 

  return {
    props: {
      data,
    },
  }
}