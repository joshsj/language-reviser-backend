import { Adverb } from "@/common/entities";
import { AdverbOf, AdverbOfs } from "@/common/language/composition";
import { Scraper } from ".";
import { prompt } from "../menu";
import { getBaseWord } from "./utilities";

// TODO: consider addition data to scrape
const scrapeAdverb: Scraper<Adverb, Adverb> = {
  menu: async () => ({
    ...(await getBaseWord("adverb")),
    french: await prompt("french", "required"),
    of: await prompt<AdverbOf>("of", "required", AdverbOfs),
  }),

  retrieve: (info) => Promise.resolve(info),
};

export { scrapeAdverb };
