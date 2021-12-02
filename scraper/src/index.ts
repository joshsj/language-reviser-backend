import { prompt } from "./menu";
import { Word } from "@/common/entities";
import { scrapeVerb } from "./scrapers/verb";

type QuitOption = "q";
const QuitOption = "q";

type WordOption = Extract<Word["type"], "verb">;

const scrapers = { verb: scrapeVerb };

const main = async () => {
  while (true) {
    const wordOption = await prompt<WordOption | QuitOption>("word option", [
      "verb",
      QuitOption,
    ]);

    if (!wordOption || wordOption === QuitOption) {
      break;
    }

    try {
      const scraper = scrapers[wordOption];

      const info = await scraper.menu();
      const word = await scraper.retrieve(info);

      console.log(word);
    } catch {
      console.log("An error occurred");
    }
  }
};

main();
