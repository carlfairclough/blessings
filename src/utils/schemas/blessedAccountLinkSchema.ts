import { JSONSchema7 } from "json-schema";

export const blessedAccountLinkSchema: JSONSchema7 = {
  $id: "https://no.co",
  $schema: "http://json-schema.org/draft-07/schema#",
  description:
    "Blessed Account Link",
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
        platform: {
          format: "string",
          type: "string",
        },
        platformId: {
          format: "string",
          type: "string",
        },
      },
      required: ["id", "platformId", "platform"],
      type: "object",
    },
    expirationDate: {
      format: "date-time",
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
  title: "Blessed Account Link",
  type: "object",
};