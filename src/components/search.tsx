import truncateAddress from "@/utils/truncateAddress";
import { Avatar, Box, Card, Fade, Flex, Input, Tag, Text } from "@chakra-ui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Search = () => {
  const { address } = useAccount();

  const [isLoaded, setIsLoaded] = useState(false);
  const [results, setResults] = useState<{ links: any[]; profiles: any[] }>();
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState<string | undefined>();

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleChange = (e: any) => {
    const { value } = e.target;

    setValue(value);
  };

  useEffect(() => {
    if (value !== undefined || '') {
    const search = async () => {
      const response: any = await fetch(`/api/mongoDb/search/${value}`);
      let r = await response.json();
      if (r) {
        console.log('results', r);
        setResults(r);
      }
    };
    search();
  }
  }, [value]);
  

  return (
    <Flex flexDirection="row" width={'100%'} maxW={450} mr='auto' position="relative">
      <Input
        type="text"
        placeholder="Search"
        value={value}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {setIsFocused(false), setValue(undefined), setResults(undefined)}}
      />
      <Fade in={(isFocused && results?.profiles.length) ? true : false} >
      <Card position="absolute" left="0" top="100%" zIndex={5}>
        <Text size='xxs' textTransform='uppercase' px={4}>Profiles</Text>
        {results?.profiles.map(({ credential }, i) => {
          return (
            <Box px={4} py={2} minWidth={320} key={i}>
              {credential.image && <Avatar src={credential.image} />}
              {credential.name && <Text as='h4' size='m'>{credential.name}</Text>}
              {credential.name && <Tag>{truncateAddress(credential.credentialSubject.id)}</Tag>}
            </Box>
          );
        })}
      </Card>
      </Fade>
    </Flex>
  );
};

export default Search;
