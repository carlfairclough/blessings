import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import Search from "./search";

const Nav = () => {
  const { address } = useAccount();

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

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
      {isLoaded && (
        <Link href={"/" + address}>
          <Avatar src="https://picsum.photos/120" />
        </Link>
      )}
    </Flex>
  );
};

export default Nav;
