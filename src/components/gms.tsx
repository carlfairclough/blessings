import { Box, Card, Fade } from "@chakra-ui/react";
import { FC, Key } from "react";
import { Address } from "wagmi";
import { Gm } from "./gm";

export const Vcs: FC<{
  credentials: any[];
  userAddress?: Address;
  handleDelete: (record: string) => void;
  onSend: () => void;
}> = ({ credentials, handleDelete, userAddress, onSend }) => {
  if (credentials.length) {
    return (
      <>
        {[...credentials].reverse().map((e: any, i: number) => {
          const entry = e.credential
          if (entry) {
            const props = {
              index: i,
              onSend:
                userAddress == entry.credentialSubject.id
                  ? onSend
                  : undefined,
              handleDelete:
                userAddress == entry.credentialSubject.id
                  ? () => handleDelete(entry.id)
                  : undefined,
              cred: {
                issuer: entry.issuer?.id,
                subject: entry.credentialSubject?.id,
                type: entry.type,
              },
            };
            return <Gm key={i} {...props} />;
          }
        })}
        {/* empty boxes to fix layout */}
        <Fade>
          <Box width="100%" maxWidth={300} minWidth={250} />
        </Fade>
        <Fade>
          <Box width="100%" maxWidth={300} minWidth={250} />
        </Fade>
      </>
    );
  } else return (<></>)
};
