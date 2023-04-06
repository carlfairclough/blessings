// import 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css"'
import Form from "@rjsf/chakra-ui";
import validator from "@rjsf/validator-ajv6";
import { FC, useEffect, useRef, useState } from "react";
import buildVc from "@/utils/vc/buildVc";
import IVC from "@/types/IVC";
import { Address, useAccount } from "wagmi";
import { JSONSchema7 } from "json-schema";
import { useSignMessage } from "wagmi";
import { verifyMessage } from "ethers/lib/utils.js";
import { Button, ButtonProps } from "@chakra-ui/react";
import { gmschema } from "@/utils/schemas/gm";
import { useToast } from "@chakra-ui/react";
import Link from "next/link";

interface SendGmProps extends ButtonProps {
  recipient: Address;
  onSend: () => void;
  customLabel?: string;
}
export const SendGm: FC<SendGmProps> = ({
  customLabel,
  recipient,
  onSend,
  ...rest
}) => {
  // const [formData, setFormData] = useState<{ [key: string]: any }>();
  const [vc, setVc] = useState<IVC | null>(null);
  const { address, isConnected } = useAccount();
  const toast = useToast();

  const recoveredAddress = useRef<string>();
  const { data, error, isLoading, signMessage } = useSignMessage({
    async onSuccess(data, variables) {
      // Verify signature when sign message succeeds
      const address = verifyMessage(variables.message, data);
      recoveredAddress.current = address;
      console.log(variables);
      const response = await fetch("/api//mongoDb/credentials/create", {
        method: "POST",
        body: JSON.stringify({
          credential: vc,
          recipient: recipient,
          signature: data,
        }),
      });

      toast({
        title: `GM sent`,
        description: <Link href={`/${recipient}`}>View profile →</Link>,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      onSend();
      return response.json();
    },
  });

  const handleSubmit = async () => {
    if (isConnected) {
      const a = await signMessage({ message: JSON.stringify(vc) });
    }
  };

  useEffect(() => {
    const newData = { id: recipient };
    if (address)
      setVc(buildVc(address as string, newData, gmschema, recipient));
  }, [isConnected, address, recipient, setVc]);

  if (isConnected) {
    return (
      <Button onClick={handleSubmit} {...rest}>
        {customLabel || "Send a gm"}
      </Button>
    );
  }
  return <></>;
};
