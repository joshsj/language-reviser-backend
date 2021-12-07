import {
  Word,
  AdjectiveOptions,
  VerbOptions,
  ChallengeOptions,
} from "@/common/entities";

// TODO: this is nasty tbf

const toWordTypeFilter = <T extends Word>(
  type: T["type"],
  options: { [K in keyof T]?: unknown } = {}
) => ({ type, ...options });
type WordTypeFilter = ReturnType<typeof toWordTypeFilter>;

const adjectiveFilter = ({}: AdjectiveOptions): WordTypeFilter =>
  toWordTypeFilter("adjective");

const verbFilter = ({ regular, irregular }: VerbOptions): WordTypeFilter => {
  const regulars = [];

  regular && regulars.push(true);
  irregular && regulars.push(false);

  return toWordTypeFilter("verb", {
    regular: { $in: regulars },
  });
};

const challengeOptions = ({ adjective, verb }: ChallengeOptions) => {
  const typeFilters: WordTypeFilter[] = [];

  adjective && typeFilters.push(adjectiveFilter(adjective));
  verb && typeFilters.push(verbFilter(verb));

  return typeFilters.length ? { $or: typeFilters } : {};
};

export { challengeOptions };
