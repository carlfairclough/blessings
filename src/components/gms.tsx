import { Box, Card, Fade } from "@chakra-ui/react";
import { FC, Key, useEffect, useState } from "react";
import { Address, useEnsName } from "wagmi";
import { Gm } from "./gm";
import { Select, chakraComponents } from "chakra-react-select";

const customComponents = {
  //@ts-ignore
  Option: ({ children, ...props }) => {
    return (
      //@ts-ignore
      <chakraComponents.Option {...props}>{children}</chakraComponents.Option>
    );
  },
};

export const Vcs: FC<{
  credentials: any[];
  userAddress?: Address;
  handleDelete: (record: string) => void;
  onSend: () => void;
}> = ({ credentials, handleDelete, userAddress, onSend }) => {

  const issuers: any[] = [];

  const creds = () =>
    [...credentials]
      .reverse()
      .map((e: any, i: number) => {
        const entry = e.credential;
        // if (entry) {
        if (!issuers.some((i) => i?.value === entry.issuer.id)) {
          issuers.push({
            value: entry.issuer.id,
            label: entry.issuer.id,
          });
        }
        const props = {
          index: i,
          onSend:
            userAddress == entry.credentialSubject.id ? onSend : undefined,
          handleDelete:
            userAddress == entry.credentialSubject.id
              ? () => handleDelete(entry.id)
              : undefined,
          cred: {
            issuer: entry.issuer?.id,
            subject: entry.credentialSubject?.id,
            type: entry.type,
            issuanceDate: entry.issuanceDate,
          },
        };
        return props
      })
      .filter((n) => n);

  if (credentials.length) {
    return (
      <>
        {creds().map((cred: any, i: number) => {
          return <Gm key={i} {...cred} />;
        })}
      </>
    );
  } else return <></>;
};
