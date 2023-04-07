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
import { gmschema } from "@/utils/schemas/gm";
import { blessingschema } from "@/utils/schemas/blessing";
import { SendCred } from "./sendCred";

export const Gm: FC<{
  cred: { subject: Address; issuer: Address, type: string[] };
  handleDelete?: () => void;
  onSend?: () => void;
  index?: number;
}> = ({ cred, cred: { subject, issuer, type }, handleDelete, onSend, index }) => {
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

  console.log(type)

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
          {type && type[1] == 'GmCredential' && 'GM'}
          {type && type[1] == 'Blessing' && '🙏 blessing 🕊 '  }
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
        {handleDelete && onSend && (type[1] == 'GmCredential' || type[1] == 'Blessing') && (
          <SendCred
            recipient={issuer}
            onSend={() => onSend()}
            colorScheme={type[1] == 'Blessing' ? 'teal' : undefined}
            successText={type[1] == 'GmCredential' ? 'gm sent, ser' : 'good karma for you'}
            schema={type[1] == 'GmCredential' ? gmschema : blessingschema}
            customLabel={type[1] == 'GmCredential' ? "Say it back" : '🕊 mutual bless' }
            mb={2}
            mt={3}
          />
        )}
        {handleDelete && <Button onClick={() => handleDelete()}>Delete</Button>}
      </Card>
    </Fade>
  );
};
