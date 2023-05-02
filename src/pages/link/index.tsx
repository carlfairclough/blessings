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
  Button,
  Tag,
  FormHelperText,
  InputRightElement,
  InputGroup,
  Tooltip,
  Text,
  Grid,
  Card,
  Heading,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FC, Key, useCallback, useEffect, useRef, useState } from "react";
import { Address, useAccount, useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils.js";
import CreateTwitterLink from "@/components/createTwitterLink";
import truncateAddress from "@/utils/truncateAddress";
import { phishingNames } from "@/utils/lists/phishingNames";
import NameStatusTag from "@/components/nameStatusTag";
import { GetServerSideProps } from "next";
import CeramicConnect from "@/components/linkCeramic";

const Link: FC = () => {
  return <h1>'hello world'</h1>;
};

export default Link;
