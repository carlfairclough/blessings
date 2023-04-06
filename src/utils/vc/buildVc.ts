import IVC from "@/types/IVC";
import { JSONSchema7 } from "json-schema";
import { addSchemaToVc } from "./addSchemaToVc";
import { v4 as uuidv4 } from "uuid";

function buildVc(
  issuer: string,
  credSubject: Record<string, any>,
  schema?: JSONSchema7,
  recipient?: string,
  other?: any,
): IVC {
  const vc: IVC = {
    "@context": ["https://www.w3.org/2018/credentials/v1"],
    type: ["VerifiableCredential"],
    issuer: { id: issuer },
    issuanceDate: new Date().toISOString(),
    id: issuer + "#" + uuidv4(),
    credentialSubject: {
      id: recipient || credSubject.id || issuer,
      ...credSubject,
    },
    ...other,
  };

  if (credSubject.expiration || credSubject.expirationDate) {
    const expirationDateObj = new Date(credSubject.expiration || credSubject.expirationDate);
    if (!isNaN(expirationDateObj.getTime())) {
      vc.expirationDate = expirationDateObj.toISOString();
    }
  }

  if (schema) {
    return addSchemaToVc(schema, vc, true);
  } else {
    return vc;
  }
}

export default buildVc