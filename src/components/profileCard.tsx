import { generateJSXMeshGradient } from "@/utils/general/meshGradient";
import { phishingNames } from "@/utils/lists/phishingNames";
import {
  Avatar,
  Box,
  Card,
  CardProps,
  DarkMode,
  Fade,
  Text,
} from "@chakra-ui/react";
import Image from "next/image";
import { FC, Key, useEffect, useState } from "react";
import { Address } from "wagmi";
import NameStatusTag, { TNameStatus } from "./nameStatusTag";

interface ProfileCardProps extends CardProps {
  image?: string;
  displayName?: string;
  address: Address;
  bio?: string;
  index?: number;
  status?: TNameStatus;
}

const ProfileCard: FC<ProfileCardProps> = ({
  image,
  status: nameStatus,
  displayName,
  address,
  bio,
  index,
  ...rest
}) => {
  const [visible, setIsVisible] = useState(false);
  const e = address && address.slice(0, 6) + "..." + address.slice(-4);
  const [links, setLinks] = useState<any[] | undefined>([]);
  const [status, setStatus] = useState<TNameStatus>(nameStatus);

  useEffect(() => {
    if (!nameStatus) {
      const links = async () => {
        const response: any = await fetch(
          `/api/mongoDb/credentials/get/${address}/accountLinks`
        );
        const r = await response.json();
        if (r) {
          setLinks(r);
        } else {
          setLinks(r);
        }
      };
      if (address) {
        links();
      }
    }
  }, [address, nameStatus, setLinks]);

  useEffect(() => {
    const timer = setTimeout(
      () => {
        setIsVisible(true);
      },
      index ? index * 500 : 0
    );
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    if (!nameStatus) {
      let n: TNameStatus;
      if (
        links?.some(
          (link) =>
            link?.credential?.handle === displayName || displayName === address
        )
      ) {
        n = "verified";
      } else if (phishingNames?.some((name) => name === name)) {
        n = "unverified";
      } else {
        n = "suspicious";
      }
      setStatus(n);
    }
  }, [links, nameStatus, address, displayName]);

  return (
    <Fade in={visible}>
      <Card
        backgroundImage={"url(https://gm.disco.xyz/images/holo.jpeg)"}
        backgroundSize="cover"
        width="250px"
        borderRadius={16}
        padding={4}
        position="relative"
        transition="all 0.5s ease-in-out"
        sx={generateJSXMeshGradient(6, address)}
        _hover={{
          // ...generateJSXMeshGradient(6, address.substring(0, 8)),
          ":before": {
            ...generateJSXMeshGradient(6, address.substring(0, 8)),
          },
        }}
        _before={{
          zIndex: -1,
          content: "''",
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,

          transition: "all 0.5s ease-in-out",
          ...generateJSXMeshGradient(6, address),
          filter: "blur(24px)",
        }}
        {...rest}
      >
        {image ? (
          <Avatar src={image} size="2xl" boxShadow="outline" />
        ) : (
          <Box height={124} width="100%" />
        )}
        <Text color={"purple"} fontSize="xs" textTransform={"uppercase"} mt={3}>
          Name
        </Text>
        <Text color={"purple"} fontSize="m">
          {displayName || e || "error"}{" "}
          <NameStatusTag status={nameStatus || status} />
        </Text>
        {displayName && (
          <Text color={"purple"} fontSize="xs" textTransform={"uppercase"}>
            {e}
          </Text>
        )}

        <Text color={"purple"} fontSize="xs" textTransform={"uppercase"} mt={3}>
          Bio
        </Text>
        <Text color={"purple"} noOfLines={3}>
          {bio || "Bio not set"}
        </Text>
      </Card>
    </Fade>
  );
};

export default ProfileCard;
