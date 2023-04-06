interface IVC {
  "@context": string | string[];
  id?: string;
  type: string[];
  issuer: string | { id: string; [key: string]: any };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: { [key: string]: any };
  proof?: {
    type?: string;
    jwt?: string;
    proofValue?: string;
    created?: string;
    eip712Domain?: { [key: string]: any };
    proofPurpose?: string;
    verificationMethod?: string;
  };
  credentialSchema?: {
    id: string;
    type: string;
  };
}

export default IVC