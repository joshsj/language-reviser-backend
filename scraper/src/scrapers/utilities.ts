import { prompt } from "../menu";
import { WordCategories, WordCategory } from "@/common/entities";

const getCategories = async (): Promise<WordCategory[]> => {
  const loop = () =>
    prompt<WordCategory | "done">("category", "required", [
      ...WordCategories,
      "done",
    ]);

  const categories: WordCategory[] = [];

  while (true) {
    const result = await loop();

    if (result === "done") {
      break;
    }

    categories.push(result);
  }

  return categories;
};

const getWordBase = async () => ({
  english: await prompt("english", "required"),
  context: await prompt("context", "optional"),
  categories: await getCategories(),
});

export { getWordBase, getCategories };
