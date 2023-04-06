import { JSONSchema7 } from "json-schema";

export const accountLinkSchema: JSONSchema7 = {
  $id: "https://no.co",
  $schema: "http://json-schema.org/draft-07/schema#",
  description:
    "Basic public profile",
  properties: {
    "@context": {
      anyOf: [
        {
          type: "string",
        },
        {
          type: "array",
        },
        {
          type: "object",
        },
      ],
    },
    credentialSchema: {
      properties: {
        id: {
          format: "uri",
          type: "string",
        },
        type: {
          type: "string",
        },
      },
      required: ["id", "type"],
      type: "object",
    },
    credentialSubject: {
      properties: {
        id: {
          // format: "uri",
          title: "Recipient DID",
          type: "string",
        },
      },
      required: ["id"],
      type: "object",
    },
    handle: {
      format: "sting",
      type: "string",
    },
    evidence: {
      format: "sting",
      type: "string",
    },
    platform: {
      format: "sting",
      type: "string",
    },
    expirationDate: {
      format: "date-time",
      type: "string",
    },
    id: {
      format: "uri",
      type: "string",
    },
    issuanceDate: {
      format: "date-time",
      type: "string",
    },
    issuer: {
      anyOf: [
        {
          format: "uri",
          type: "string",
        },
        {
          properties: {
            id: {
              format: "uri",
              type: "string",
            },
          },
          required: ["id"],
          type: "object",
        },
      ],
    },
    type: {
      anyOf: [
        {
          type: "string",
        },
        {
          items: {
            type: "string",
          },
          type: "array",
        },
      ],
    },
  },
  required: [
    "@context",
    "type",
    "issuer",
    "issuanceDate",
    "credentialSubject",
  ],
  title: "Account Link Credential",
  type: "object",
};