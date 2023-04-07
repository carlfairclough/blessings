// String to numbers
// dids aren't hexadecimal
// 0-9 = 10
// a - z = 26
// 36 characters total
const alphaVal = (s: string) => {
  // set v for numbers
  let v = s.toLowerCase().charCodeAt(0) - 47;
  if (v > 10) {
    // set v for a to z
    v = v - 39;
  }
  return v;
};

// Number between 2 values from a character
const getNumber = (max: number, seed: string): number => {
  const val = (max / 36) * alphaVal(seed);
  return Math.round(val);
};

// Generate Hue from character
const getColor = (seed: string): number => {
  return getNumber(360, seed);
};

// Generate percentage from character
const getPercent = (value: number, seed: string): number => {
  const val = (getNumber(100, seed) * value) % 100;
  return Math.round(val);
};

const genColors = (length: number, initialHue: number): string[] => {
  return Array.from({ length }, (_, i) => {
    // analogous colors + complementary colors
    // https://uxplanet.org/how-to-use-a-split-complementary-color-scheme-in-design-a6c3f1e22644

    // base color
    if (i === 0) {
      return `hsl(${initialHue}, 100%, 80%)`;
    }

    // analogous colors
    if (i < length / 1.4) {
      return `hsl(${
        initialHue - 30 * (1 - 2 * (i % 2)) * (i > 2 ? i / 2 : i)
      }, 100%, ${76 - i * (1 - 2 * (i % 2)) * 1.75}%)`;
    }

    // complementary colors
    return `hsl(${initialHue - 150 * (1 - 2 * (i % 2))}, 100%, ${
      76 - i * (1 - 2 * (i % 2)) * 1.25
    }%)`;
  });
};

const genGrad = (
  length: number,
  colors: string[],
  seed: string[]
): string[] => {
  // reverse the array to use last characters
  const seeds = seed.slice((length + 1) * -1);
  return Array.from({ length }, (_, i) => {
    if (seeds[i].length) {
      const grad = `radial-gradient(at ${getPercent(i, seeds[i])}% ${getPercent(
        i * 1,
        seeds[i]
      )}%, ${colors[i]} 0px, transparent 50%)`;
      return grad
    }
    return ``;
  });
};

const genStops = (length: number, fullSeed: string) => {
  const seedArr = fullSeed.split("");

  const colors = genColors(length, getColor(seedArr[seedArr.length - 1]));
  const proprieties = genGrad(length, colors, seedArr);
  return [colors[0], proprieties.join(",")];
};

const generateMeshGradient = (length: number, fullSeed: string) => {
  const [bgColor, bgImage] = genStops(length, fullSeed);
  return `background-color: ${bgColor}; background-image:${bgImage}`;
};

const generateJSXMeshGradient = (length: number, fullSeed: string) => {
  const [bgColor, bgImage] = genStops(length, fullSeed);
  return { backgroundColor: bgColor, backgroundImage: bgImage };
};

export { generateMeshGradient as generateMeshGradient };
export { generateJSXMeshGradient as generateJSXMeshGradient };
