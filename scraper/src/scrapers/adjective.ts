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

const removeChildren = (el: Element) => {
  type Child = Partial<Pick<HTMLElement, "tagName" | "id">>;

  const children = [...el.childNodes];

  const startIndex = children.findIndex(
    (e) => (e as Child).id === "inflections"
  );

  const endIndex = children
    .slice(startIndex)
    .findIndex((c) => (c as Child).tagName?.toLowerCase() === "br");

  console.log(children[startIndex], children[endIndex]);

  const toRemove = [
    ...children.slice(0, startIndex),
    ...children.slice(startIndex + endIndex),
  ];

  toRemove.forEach((e) => el.removeChild(e));
};

const getData = (document: Document) => {
  const root = document.querySelector(".inflectionsSection")!;

  removeChildren(root);

  Array.from(root.childNodes).forEach(console.log);

  const dataMatch = root.textContent!.match(
    /Inflections of '(?<m>.+)' \((?<type>.+)\):  (?<rest>.+)/
  )!.groups! as DataMatch;

  console.log(dataMatch.rest);

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
