import { Verb, WordCategories, WordCategory } from "@/common/entities";
import { JSDOM } from "jsdom";
import { Scraper } from ".";
import { prompt, yesNo } from "../menu";

const TextKey = "textContent";
type Conjugations = [string, string, string, string, string, string];

type VerbInfo = Pick<
  Verb,
  "infinitive" | "english" | "regular" | "context" | "categories"
>;

const getVerbData = (
  document: Document
): Pick<Verb, "infinitive" | "forms"> => {
  const infinitive = document.querySelector("#ch_lblVerb")?.[TextKey]!;

  const [je, tu, il, nous, vous, ils] = [
    ...document.querySelectorAll(`[mobile-title="Indicatif Présent"] .verbtxt`),
  ].map((el) => el[TextKey]!) as Conjugations;

  return { infinitive, forms: { je, tu, il, nous, vous, ils } };
};

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

const scrapeVerb: Scraper<Verb, VerbInfo> = {
  menu: async () => {
    const info = {
      infinitive: await prompt("infinitive", "required"),
      english: await prompt("english", "required"),
      context: await prompt("context", "optional"),
      regular: await yesNo("regular"),
      categories: await getCategories(),
    };

    return { ...info, regular: info.regular === "y" ? true : false };
  },

  retrieve: async (info) => {
    const url = `https://conjugator.reverso.net/conjugation-french-verb-${info.infinitive}.html`;

    const { document } = (await JSDOM.fromURL(url)).window;

    return { type: "verb", ...info, ...getVerbData(document) };
  },
};

export { scrapeVerb };
