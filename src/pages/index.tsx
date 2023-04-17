import Head from "next/head";
import Image from "next/image";
import { FC, Key, useCallback, useEffect, useRef, useState } from "react";
import Airtable, { FieldSet, Records } from "airtable";
import { Address, useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useSignMessage, useEnsName } from "wagmi";
import { verifyMessage } from "ethers/lib/utils";
import { Blessing } from "@/components/blessing";
import { Blessings } from "@/components/blessings";
import { SendBlessing } from "@/components/sendBlessing";
import styled from "styled-components";
import { Container, Flex, Grid, SimpleGrid, Text } from "@chakra-ui/react";
import ProfileCard from "@/components/profileCard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import useSWR from "swr";

export default function Home() {
  // const { profiles } = data;
  const [profiles, setProfiles] = useState<any[]>([]);
  useEffect(() => {
    const mongoData = async () => {
      const response: any = await fetch(
        `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/mongoDb/profile/all`
      );
      const r = await response.json();
      if (r) {
        console.log(r);
        setProfiles(r);
      } else {
        setProfiles([]);
      }
    };
    mongoData();
  }, []);

  return (
    <>
      <Head>
        <title>🙏 blessed 🙏</title>
      </Head>
      <Container w="full" maxW={"container.xl"}>
        <Text as="h1" fontSize="l" mb={8}>
          Blessed Profilesss
        </Text>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
          gridColumnGap={{ base: 8, md: 16 }}
          gridRowGap={{ base: 8, md: 16 }}
          pb={50}
        >
          {profiles &&
            profiles?.map((profile: any, i: Key) => (
              <Link
                key={i}
                href={"/" + profile.credential.credentialSubject.id}
              >
                <ProfileCard
                  image={profile.credential?.image}
                  address={profile.credential.credentialSubject.id}
                  displayName={profile.credential?.name}
                  bio={profile.credential?.bio}
                />
              </Link>
            ))}
        </SimpleGrid>
      </Container>
    </>
  );
}

// type Data = {
//   profiles: any;
// };

// export const getServerSideProps: GetServerSideProps<{
//   data: Data;
// }> = async () => {
//   console.log(
//     `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/mongoDb/profile/all`
//   );
//   const getProfiles = await fetch(
//     `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/mongoDb/profile/all`
//   );
//   const profiles = await getProfiles.json();

//   const data: Data = await {
//     profiles: profiles,
//   };

//   return {
//     props: {
//       data,
//     },
//   };
// };
