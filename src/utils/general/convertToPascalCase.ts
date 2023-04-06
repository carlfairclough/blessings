
import slugify from "@sindresorhus/slugify";

function convertToPascalCase(s: string): string {
  return slugify(s).replace(/(^|-)./g, (x) => x.replace("-", "").toUpperCase());
}

export default convertToPascalCase