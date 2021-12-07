import { Adjective } from "@/common/entities";
import { JSDOM } from "jsdom";
import { Scraper } from ".";
import { prompt } from "../menu";
import { getWordBase } from "./utilities";

type AdjectiveInfo = Pick<
  Adjective,
  "english" | "context" | "categories" | "masculineSingular"
>;

type DataMatch = {
  type: "adj" | string;
  m: string;
  rest: string;
};

type Rest = [["f", string], ["mpl", string], ["fpl", string]];

const getRest = (rest: string) =>
  rest.split(",  ").map((r) => r.split(": ")) as Rest;

const removeRootChildren = (el: Element) =>
  [...el.childNodes]
    .filter(
      (e) =>
        String((e as HTMLElement | undefined)?.tagName).toLowerCase() === "div"
    )
    .forEach((e) => el.removeChild(e));

const getData = (document: Document) => {
  const root = document.querySelector(".inflectionsSection")!;

  removeRootChildren(root);

  const dataMatch = root.textContent!.match(
    /Inflections of '(?<m>.+)' \((?<type>.+)\):  (?<rest>.+)/
  )!.groups! as DataMatch;

  const rest = getRest(dataMatch.rest);

  return { ...dataMatch, rest };
};

const scrapeAdjective: Scraper<Adjective, AdjectiveInfo> = {
  menu: async () => ({
    ...(await getWordBase()),
    masculineSingular: await prompt("masculine singular", "required"),
  }),

  retrieve: async (info) => {
    const url = `https://www.wordreference.com/fren/${info.masculineSingular}`;

    const { document } = (await JSDOM.fromURL(url)).window;

    const data = getData(document);

    return {
      ...info,
      type: "adjective",
      masculineSingular: data.m,
      feminineSingular: data.rest[0][1],
      masculinePlural: data.rest[1][1],
      femininePlural: data.rest[2][1],
    };
  },
};

export { scrapeAdjective };
