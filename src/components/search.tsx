import truncateAddress from "@/utils/truncateAddress";
import {
  Avatar,
  Box,
  Card,
  Fade,
  Flex,
  Input,
  Tag,
  Text,
} from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Address, useAccount, useEnsAddress, useEnsName } from "wagmi";

const Search = () => {
  const { address } = useAccount();

  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState<{ links: any[]; profiles: any[] }>();
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState<string | undefined>();
  const { push } = useRouter();
  const [isDelayOver, setIsDelayOver] = useState(true);
  const [ensAddress, setEnsAddress] = useState<string | null | undefined>();
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e: any) => {
    const { value } = e.target;
    setValue(value);
  };

  const { data: ens } = useEnsAddress({
    name: value,
  });

  useEffect(() => {
    const fetchData = async () => {
      if (value) {
        console.log(`/api/mongoDb/search/${ens || value}`)
        const response: any = await fetch(
          `/api/mongoDb/search/${ens || value}`
        );
        const r = await response.json();
        if (r) {
          setResults(r);
        }
      }
    };

    if (isDelayOver) {
      setResults(undefined);
      fetchData();
    }
  }, [value, isDelayOver]);

  useEffect(() => {
    setIsDelayOver(true);
    const a = setTimeout(() => {
      setIsDelayOver(true);
    }, 3000);
    return () => {
      clearTimeout(a);
    };
  }, [value]);

  return (
    <Flex
      flexDirection="row"
      width={"100%"}
      maxW={450}
      mr="auto"
      position="relative"
    >
      <Input
        type="text"
        placeholder="Search"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false);
        }}
      />
      <Fade in={isFocused && results?.profiles.length ? true : false}>
        <Card position="absolute" left="0" top="100%" zIndex={5}>
          <Text size="xxs" textTransform="uppercase" px={4}>
            Profiles
          </Text>
          {results?.profiles.map(({ credential }, i) => {
            return (
              <a href={"/" + credential.credentialSubject.id} key={i}>
                <Box px={4} py={2} minWidth={320}>
                  {credential.image && <Avatar src={credential.image} />}
                  {credential.name && (
                    <Text as="h4" size="m">
                      {credential.name}
                    </Text>
                  )}
                  {credential.name && (
                    <Tag>
                      {truncateAddress(credential.credentialSubject.id)}
                    </Tag>
                  )}
                </Box>
              </a>
            );
          })}
        </Card>
      </Fade>
    </Flex>
  );
};

export default Search;
