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
import { Container, Flex, Grid, Text } from "@chakra-ui/react";
import ProfileCard from "@/components/profileCard";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Link from "next/link";

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
    fontSize: 24,
  },
});

export default function Home({
  data,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const { profiles } = data;
  return (
    <>
      <Head>
        <title>🙏 blessed 🙏</title>
      </Head>
      <Container w="full" maxW={"container.xl"}>
        <Text as="h1" fontSize="l" mb={8}>
          Blessed Profiles
        </Text>
        <Flex flexWrap={"wrap"} justifyContent="space-between">
          {profiles.map((profile: any, i: Key) => (
            <Link key={i} href={"/" + profile.credential.credentialSubject.id}>
              <ProfileCard
                image={profile.credential?.image}
                address={profile.credential.credentialSubject.id}
                displayName={profile.credential?.name}
                bio={profile.credential?.bio}
              />
            </Link>
          ))}
        </Flex>
      </Container>
    </>
  );
}

type Data = {
  profiles: any;
};

export const getServerSideProps: GetServerSideProps<{
  data: Data;
}> = async () => {
  console.log(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/mongoDb/profile/all`
  );
  const getProfiles = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/mongoDb/profile/all`
  );
  const profiles = await getProfiles.json();

  const data: Data = await {
    profiles: profiles,
  };

  return {
    props: {
      data,
    },
  };
};
