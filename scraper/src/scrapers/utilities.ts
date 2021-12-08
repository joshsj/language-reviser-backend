import { collect, prompt } from "../menu";
import { WordCategories, WordCategory } from "@/common/entities";

const getCategories = () =>
  collect<WordCategory, "done">("categories", WordCategories, "done");

const getWordBase = async () => ({
  english: await prompt("english", "required"),
  context: await prompt("context", "optional"),
  categories: await getCategories(),
});

export { getWordBase, getCategories };
