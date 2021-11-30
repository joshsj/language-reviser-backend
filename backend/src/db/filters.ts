import { ChallengeOptions, NounOptions, VerbOptions } from "@shared/game";
import { Word } from "./types";

// TODO: this is nasty tbf

const toWordTypeFilter = <T extends Word>(
  type: T["type"],
  options: { [K in keyof T]?: unknown } = {}
) => ({ type, ...options });
type WordTypeFilter = ReturnType<typeof toWordTypeFilter>;

const nounFilter = ({}: NounOptions): WordTypeFilter =>
  toWordTypeFilter("noun");

const verbFilter = ({ regular, irregular }: VerbOptions): WordTypeFilter => {
  const regulars = [];

  regular && regulars.push(true);
  irregular && regulars.push(false);

  return toWordTypeFilter("verb", {
    regular: { $in: regulars },
  });
};

const challengeOptions = ({ noun, verb }: ChallengeOptions) => {
  if (!(verb || noun)) {
    return {};
  }

  const typeFilters: WordTypeFilter[] = [];

  noun && typeFilters.push(nounFilter(noun));
  verb && typeFilters.push(verbFilter(verb));

  return { $or: typeFilters };
};

export { challengeOptions };
