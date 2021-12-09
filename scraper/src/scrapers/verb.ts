import { BaseWord, Verb } from "@/common/entities";
import { JSDOM } from "jsdom";
import { Scraper } from ".";
import { prompt, yesNo } from "../menu";
import { getBaseWord } from "./utilities";

const TextKey = "textContent";
type Conjugations = [string, string, string, string, string, string];

type VerbInfo = BaseWord<"verb"> & Pick<Verb, "infinitive" | "regular">;

const getData = (document: Document): Pick<Verb, "infinitive" | "forms"> => {
  const infinitive = document.querySelector("#ch_lblVerb")?.[TextKey]!;

  const [je, tu, il, nous, vous, ils] = [
    ...document.querySelectorAll(`[mobile-title="Indicatif Présent"] .verbtxt`),
  ].map((el) => el[TextKey]!) as Conjugations;

  return { infinitive, forms: { je, tu, il, nous, vous, ils } };
};

const scrapeVerb: Scraper<Verb, VerbInfo> = {
  menu: async () => {
    const info = {
      ...(await getBaseWord("verb")),
      infinitive: await prompt("infinitive", "required"),
      regular: await yesNo("regular"),
    };

    return { ...info, regular: info.regular === "y" ? true : false };
  },

  retrieve: async (info) => {
    const url = `https://conjugator.reverso.net/conjugation-french-verb-${info.infinitive}.html`;

    const { document } = (await JSDOM.fromURL(url)).window;

    return { ...info, ...getData(document) };
  },
};

export { scrapeVerb };
