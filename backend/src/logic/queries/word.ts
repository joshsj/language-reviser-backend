import { ChallengeOptions, Word } from "@/common/entities";
import { FilterQuery } from "mongoose";

const challengeOptionsFilters: {
  [K in keyof ChallengeOptions]?: (
    options: ChallengeOptions
  ) => FilterQuery<Word>;
} = {
  verb: ({ verb }) => {
    if (!verb) {
      return {};
    }

    const { regular, irregular } = verb;

    const isRegular = [];
    regular && isRegular.push(true);
    irregular && isRegular.push(false);

    return isRegular.length ? { regular: { $in: isRegular } } : {};
  },

  categories: ({ categories }) =>
    categories && categories.length ? { categories: { $in: categories } } : {},
};

const fromChallengeOptions = (options: ChallengeOptions): FilterQuery<Word> => {
  const filters = Object.keys(options).map(
    (k) => challengeOptionsFilters[k as keyof ChallengeOptions]?.(options) ?? {}
  );

  return filters.length ? { $and: filters } : {};
};

export { fromChallengeOptions };
