import type { AppProps } from "next/app";
import { headers } from "next/headers";
import React, { FC, useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { configureChains, createClient, useAccount, WagmiConfig } from "wagmi";
import {
  Button,
  Card,
  ChakraProvider,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
  ThemeConfig,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";

const DiscordModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isConnected, address } = useAccount();
  const finalRef = React.useRef(null);
  const { query } = useRouter();
  const [discord, setDiscord] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (query.linkdiscord) {
      const checkLink = async () => {
        try {
          console.log("checking cred");
          const response: any = await fetch(
            `http://localhost:3000/api/discordUrl/check`,
            {
              method: "POST",
              body: JSON.stringify({
                linkId: query.linkdiscord,
              }),
            }
          );
          let r = await response.json();
          console.log(r);
          if (r.valid) {
            setIsLoading(false);
            setDiscord(r.user);
          } else {
            setIsLoading(false);
            setDiscord(null);
          }
        } catch (err) {
          setIsLoading(false);
          setDiscord(null);
        }
      };

      checkLink();
      onOpen();
    }
  }, [query]);

  useEffect(() => {
    if (router.isReady && !discord && !isLoading) {
      handleClose()
      toast({
        title: "Link expired",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, discord, isLoading]);

  const onSend = async () => {
    try {
      const response = await fetch("/api/issue/discord", {
        method: "POST",
        body: JSON.stringify({
          recipient: address,
          discordId: discord.id,
          linkId: query.linkdiscord,
        }),
      });

      handleClose()
      toast({
        title: "Link created",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      console.warn(err);
      toast({
        title: "Something went wrong",
        description: "Check the console for more info",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleClose = () => {
    router.push({}, undefined, { shallow: true });
    onClose()
  }

  const DiscordBlock: FC = () => (
    <Card>
      <Text size="l" variant="l">
        Username: {discord.username}#{discord.discriminator}
      </Text>
      <Text fontFamily={"mono"} size="s">
        discord user id: {discord.id}
      </Text>

      <Text fontFamily={"mono"} size="s">
        address: {address}
      </Text>
    </Card>
  );

  return (
    <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Receive Discord Credential</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {!isConnected && <ConnectButton />}
          {isConnected && isLoading && <Spinner />}
          {isConnected && !isLoading && discord && <DiscordBlock />}
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button variant="ghost">Cancel</Button>
          <Button colorScheme="blue" mr={3} onClick={onSend}>
            Receive credential
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default DiscordModal;
