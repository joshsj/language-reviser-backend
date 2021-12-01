import { AccentHelper } from "../dependency";

const Accents = {
  a: ["à", "â"],
  e: ["é", "ê", "è", "ë"],
  i: ["î", "ï"],
  o: ["ô"],
  u: ["ù", "û", "ü"],
} as const;

const nextAccent = (accents: string[][], char: string): string => {
  for (const forms of accents) {
    const index = forms.indexOf(char);

    if (index >= 0) {
      if (index === forms.length - 1) {
        return forms[0]!;
      }

      return forms[index + 1]!;
    }
  }

  return char;
};

const accentHelper = ((): AccentHelper => {
  const accents = Object.entries(Accents).map((x) => [x[0], ...x[1]]);

  return {
    next: (char) => nextAccent(accents, char),
  };
})();

export { accentHelper };
