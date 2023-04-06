
import IVC from "@/types/IVC";
import { JSONSchema7 } from "json-schema";
import convertToPascalCase from "../general/convertToPascalCase";

export function addSchemaToVc(schema: JSONSchema7, vc: IVC, includeType?: boolean): IVC {
  if (!schema.$id) {
    throw Error("Schema missing $id property: can't use for VC credentialSchema field");
  }
  return {
    ...vc,

    type: includeType && schema.title ? vc.type.concat(convertToPascalCase(schema.title)) : vc.type,

    credentialSchema: {
      id: schema.$id,
      type: "JsonSchemaValidator2018",
    },
  };
}