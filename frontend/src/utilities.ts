import { Accents } from "@shared/language";

type NoPayload = undefined;

/* Provides the payload type for an emit declaration */
function emitT<TPayload = NoPayload>(): TPayload extends NoPayload
  ? () => void
  : (_: TPayload) => void {
  return ((_: TPayload) => void 0) as any;
}

type AccentHelper = {
  next: (char: string) => string;
};

const next = (accents: string[][], char: string): string => {
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
    next: (char) => next(accents, char),
  };
})();

const EmptyCharacter = String.fromCharCode(0x200c); // zero-width non-joiner

export { emitT, AccentHelper, accentHelper, EmptyCharacter };
