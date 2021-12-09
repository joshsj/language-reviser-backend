import { collect, prompt } from "../menu";
import {
  BaseWord,
  Word,
  WordCategories,
  WordCategory,
} from "@/common/entities";

const getCategories = () =>
  collect<WordCategory, "done">("categories", WordCategories, "done");

const getBaseWord = async <T extends Word["type"]>(
  type: T
): Promise<BaseWord<T>> => ({
  type,
  english: await prompt("english", "required"),
  context: await prompt("context", "optional"),
  categories: await getCategories(),
});

export { getBaseWord, getCategories };
