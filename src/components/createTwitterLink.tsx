import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Card,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { useRef, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils.js";
import buildVc from "@/utils/vc/buildVc";
import { accountLinkSchema } from "@/utils/schemas/accountLink";

const CreateTwitterLink = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { address } = useAccount();
  const [tweet, setTweet] = useState<string | undefined>();
  const [account, setAccount] = useState<string | undefined>();
  const [tweetId, setTweetId] = useState<string | undefined>();
  const [isError, setIsError] = useState<boolean | undefined>();
  // @ts-ignore
  const handleChange = (e) => {
    setTweet(e.target.value);
    try {
      const url = new URL(e.target.value);
      if (url.hostname == "twitter.com") {
        const path = url.pathname.replace(/^\/|\/$/g, "").split("/");
        console.log(path);
        if (path.length == 3) {
          setIsError(false);
          setAccount(path[0]);
          setTweetId(path[2]);
        } else {
          throw "Tweet link is invalid";
        }
      }
    } catch (error) {
      setIsError(true);
      console.log(error);
    }
  };

  const recoveredAddress = useRef<string>();
  const { data, error, isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
      console.log(variables);
      const response = await fetch("/api//mongoDb/link/create", {
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
      
      onClose()
      return response.json();
    },
  });

  const handleSubmit = async () => {
    const newData = { id: address };
    try {
      const vc = buildVc(
        address as string,
        newData,
        accountLinkSchema,
        address,
        {
          handle: "@" + account,
          evidence: tweet,
          platform: "twitter",
        }
      );
      const a = await signMessage({ message: JSON.stringify(vc) });
    } catch (err) {
      console.error(err)
    }
  };

  const handleClose = () => {
    setTweet('')
    setAccount('')
    setTweetId('')
    setIsError(false)
    onClose()
  }

  return (
    <>
      <Tag variant='solid' cursor='pointer' onClick={onOpen}>Add twitter account</Tag>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Link a Twitter account</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text as="p" size="m">
              Head to twitter and tweet this:
            </Text>
            <Card p={4} borderRadius={8} mb={6} mt={2} bg="whiteAlpha.100">
              <Text>
                linking to the blessed app
                <br />
                {address}
              </Text>
            </Card>
            <FormControl>
              <FormLabel>Paste a link to the tweet:</FormLabel>
              <Input type="text" value={tweet} onChange={handleChange} />
            </FormControl>

            {!isError && tweetId && <TwitterTweetEmbed tweetId={tweetId} />}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="solid" mr={3} onClick={handleSubmit}>
              Create link
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreateTwitterLink;
