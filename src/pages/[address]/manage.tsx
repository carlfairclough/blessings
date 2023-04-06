import Nav from "@/components/nav";
import ProfileCard from "@/components/profileCard";
import { profileschema } from "@/utils/schemas/profile";
import buildVc from "@/utils/vc/buildVc";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Box,
  Textarea,
  useToast,
  Link,
  Button,
  Tag,
  FormHelperText,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, Key, useCallback, useEffect, useRef, useState } from "react";
import { Address, useAccount, useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils.js";
import CreateTwitterLink from "@/components/createTwitterLink";
import truncateAddress from "@/utils/truncateAddress";
import { phishingNames } from "@/utils/lists/phishingNames";
import NameStatusTag from "@/components/nameStatusTag";

const Manage: FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { address } = useAccount();
  // const routerLegacy = useRouterLegacy();
  const [displayName, setDisplayName] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [links, setLinks] = useState<any[] | undefined>([]);
  const [inboxPublic, setInboxPublic] = useState<boolean | undefined>(true);
  const [refresh, setRefresh] = useState<number>(0);
  const [profile, setProfile] = useState<any>();
  const [isLoaded, setIsLoaded] = useState<boolean>();

  const [nameStatus, setNameStatus] = useState<
    "verified" | "unverified" | "suspicious" | undefined
  >();

  const recoveredAddress = useRef<string>();

  const { data, error, isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
      console.log(variables);
      const response = await fetch("/api//mongoDb/profile/create", {
        method: "POST",
        body: JSON.stringify({
          credential: JSON.parse(variables.message as string),
          recipient: address,
          signature: data,
        }),
      });

      toast({
        title: `Profile credential issued`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setRefresh(refresh + 1);
      return response.json();
    },
  });

  useEffect(() => {
    if (address) {
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
      links();
    }
  }, [address, setLinks, refresh]);

  useEffect(() => {
    const profile = async () => {
      const response: any = await fetch(
        `/api/mongoDb/credentials/get/${address}/profile`
      );
      let r = await response.json();
      if (r) {
        console.log("setting profile");
        setBio(r.credential?.bio);
        setDisplayName(r.credential?.name);
        setImage(r.credential?.image);
        setIsLoaded(true);
      }
    };
    if (address) {
      profile();
    }
  }, [address]);

  const handleSave = async () => {
    const newData = { id: address };
    const vc = buildVc(address as string, newData, profileschema, address, {
      bio: bio,
      name: displayName,
      image: image,
    });
    const a = await signMessage({ message: JSON.stringify(vc) });
  };

  useEffect(() => {
    console.log("cchceeekkkk");
    let n: typeof nameStatus;
    if (
      links?.some(
        (link) =>
          link?.credential?.handle === displayName || displayName === address
      )
    ) {
      console.log("verified name chosen");
      n = "verified";
    } else if (phishingNames?.some((name) => name === displayName)) {
      n = "suspicious";
    } else {
      n = "unverified";
    }
    setNameStatus(n);
  }, [displayName, links, address]);

  const p = {
    suspicious: {
      color: "red.500",
      text: "Suspicious",
    },
    verified: {
      color: "green.300",
      text: "Verified",
    },
    unverified: {
      text: "Unverified",
      color: "yellow.200",
    },
  };

  console.log(nameStatus);

  return (
    <Flex width="full" justifyContent="center" p="4">
      <Box width="full" maxWidth="container.xl">
        {/* <SignIn /> */}

        <Flex as="header" w="full" alignItems={"flex-start"}>
          <Box mr={12}>
            {address && isLoaded && (
              <ProfileCard
                status={nameStatus}
                displayName={displayName}
                bio={bio}
                address={address as Address}
                image={image}
              />
            )}
          </Box>
          <Box mr={12}></Box>
          <Flex flexWrap="wrap" justifyContent="space-between" w="full">
            <FormControl>
              <FormLabel>Display Name</FormLabel>
              <InputGroup>
                {isLoaded && (
                  <InputRightElement
                    mr="2"
                    width="fit-content"
                    pointerEvents="none"
                  >
                    <NameStatusTag status={nameStatus} />
                  </InputRightElement>
                )}
              </InputGroup>
              <Input
                type="text"
                value={displayName || ''}
                onChange={(e) => setDisplayName(e.target.value)}
              />

              <FormHelperText display={"flex"} alignItems="center">
                Use an account link to remove the unverified tag:{" "}
                {links?.map(
                  (link, i) =>
                    link?.credential?.handle && (
                      <Tag
                        key={i}
                        cursor="pointer"
                        mx={1}
                        onClick={() => setDisplayName(link.credential.handle)}
                      >
                        {link.credential.handle}
                      </Tag>
                    )
                )}
                {isLoaded && address && (
                  <Tag
                    mx={2}
                    onClick={() => setDisplayName(address)}
                    cursor="pointer"
                  >
                    {truncateAddress(address as string)}
                  </Tag>
                )}
                <CreateTwitterLink />
              </FormHelperText>
            </FormControl>
            <FormControl mt={8}>
              <FormLabel>Image</FormLabel>
              <Input
                type="text"
                value={image || ''}
                onChange={(e) => setImage(e.target.value)}
              />
            </FormControl>
            <FormControl mt={8}>
              <FormLabel>Bio</FormLabel>
              <Textarea value={bio || ''} onChange={(e) => setBio(e.target.value)} />
            </FormControl>
            <Button onClick={handleSave} mt={8}>
              Save
            </Button>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  );
};

export default Manage;
