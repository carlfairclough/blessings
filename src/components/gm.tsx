import { FC, useEffect, useState } from "react";
import { Address, useEnsName } from "wagmi";
import {
  Card,
  Text,
  Heading,
  IconButton,
  Button,
  Tag,
  TagLeftIcon,
  Box,
  TagLabel,
  Fade,
} from "@chakra-ui/react";
import Link from "next/link";
import { SendGm } from "./sendGm";
import { LinkIcon } from "@chakra-ui/icons";

export const Gm: FC<{
  cred: { subject: Address; issuer: Address };
  handleDelete?: () => void;
  onSend?: () => void;
  index?: number;
}> = ({ cred: { subject, issuer }, handleDelete, onSend, index }) => {
  const { data: issEns } = useEnsName({ address: issuer });
  const { data: subEns } = useEnsName({ address: subject });
  const formatAddress = (addr: string) =>
    addr.slice(0, 6) + "..." + addr.slice(-4);
  const i = formatAddress(issuer);
  const s = formatAddress(subject);

  const [visible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index ? index * 50 : 0);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <Fade in={visible}>
      <Card
        width="100%"
        maxWidth={300}
        minWidth={250}
        m={3}
        border={1}
        padding={4}
        borderRadius={"lg"}
        borderColor={"ButtonFace"}
        boxShadow={"xl"}
        background={"Background"}
      >
        <Heading as="h4" size="md">
          {" "}
          GM
        </Heading>
        <Box mt={3}>
          {/* <Tag size="md">To: {subEns || s}</Tag> */}
          <Link href={`/${issuer}`}>
            <Tag size="md">
              <TagLeftIcon as={LinkIcon} />
              <TagLabel>From: {issEns || i}</TagLabel>
            </Tag>
          </Link>
        </Box>
        {handleDelete && onSend && (
          <SendGm
            recipient={issuer}
            onSend={() => onSend()}
            customLabel={"Say it back"}
            mb={2}
            mt={3}
          />
        )}
        {handleDelete && <Button onClick={() => handleDelete()}>Delete</Button>}
      </Card>
    </Fade>
  );
};
