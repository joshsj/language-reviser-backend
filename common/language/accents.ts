import { AccentHelper, Direction } from "../dependency";

const Accents = {
  a: ["à", "â"],
  e: ["é", "ê", "è", "ë"],
  i: ["î", "ï"],
  o: ["ô"],
  u: ["ù", "û", "ü"],
  c: ["ç"],
} as const;

const getAccent = (accents: string[][], char: string, d: Direction): string => {
  for (const forms of accents) {
    const index = forms.indexOf(char);

    if (index === -1) {
      continue;
    }

    if (d === "next") {
      return index === forms.length - 1 ? forms[0]! : forms[index + 1]!;
    }

    if (d === "previous") {
      return index === 0 ? forms[forms.length - 1]! : forms[index - 1]!;
    }
  }

  return char;
};

const accentHelper = ((): AccentHelper => {
  const accents = Object.entries(Accents).map((x) => [x[0], ...x[1]]);

  return {
    get: (char, d) => getAccent(accents, char, d),
  };
})();

export { accentHelper };
