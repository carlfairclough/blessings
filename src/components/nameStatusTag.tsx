import { Tag, TagProps } from "@chakra-ui/react";
import { FC } from "react";

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

export type TNameStatus = "verified" | "unverified" | "suspicious" | undefined;
export interface INameStatusTag extends TagProps {
  status: TNameStatus;
}

const NameStatusTag: FC<INameStatusTag> = ({status}) => (
  <Tag
  bg='blackAlpha.400'
    width="fit-content"
    color={(status && p[status].color) || p.unverified.color}
  >
    {status ? p[status].text : p.unverified.text}
  </Tag>
);

export default NameStatusTag