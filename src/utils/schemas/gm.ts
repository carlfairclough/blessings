import { JSONSchema7 } from "json-schema";

export const gmschema: JSONSchema7 = {
  $id: "https://raw.githubusercontent.com/discoxyz/disco-schemas/main/json/GMCredential/1-0-0.json",
  $schema: "http://json-schema.org/draft-07/schema#",
  description:
    "Send a GM greeting to colleagues and friends in your network.",
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
  title: "GM Credential",
  type: "object",
};