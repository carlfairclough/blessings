import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Search from "./search";

const Nav = () => {
  const { address, isConnected } = useAccount();

  const [isLoaded, setIsLoaded] = useState(false);
  const [image, setImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const image = async (address: string) => {
      try {
        const response: any = await fetch(
          `/api/mongoDb/credentials/get/${address}/profile`
        );
        let r = await response.json();
        if (r) {
          setImage(r.credential.image);
        }
      } catch (err) {
        setImage(undefined);
        console.warn("profile error", err);
      }
    };
    if (address) {
      image(address);
    }
  }, [address]);

  return (
    <Flex flexDirection="row" width="100%" pb={8} pt={4} alignItems={"center"}>
      <Link href="/">
        {" "}
        <Text as="h1" variant="m" pr={8}>
          blessed
        </Text>
      </Link>
      <Search />
      <ConnectButton />
      {isLoaded && isConnected && (
        <Link href={"/" + address}>
          <Avatar ml={4} src={image} />
        </Link>
      )}
    </Flex>
  );
};

export default Nav;
