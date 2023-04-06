import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Tag,
  useDisclosure,
} from "@chakra-ui/react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { useRef } from "react";

const TwitterLink = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();

  return (
    <>
      <Tag colorScheme={"twitter"} />
      {}

      <AlertDialog
        isOpen={isOpen}
        //@ts-ignore
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Customer
            </AlertDialogHeader>

            <AlertDialogBody>
              <TwitterTweetEmbed tweetId={"933354946111705097"} />
            </AlertDialogBody>

            <AlertDialogFooter>
              {/* @ts-ignore */}
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};
