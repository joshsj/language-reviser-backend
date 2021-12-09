import WebSocket from "ws";
import { prompt, yesNo } from "./menu";
import { Word } from "@/common/entities";
import { scrapeVerb } from "./scrapers/verb";
import { ClientMessage } from "@/common/messages";
import { scrapeAdjective } from "./scrapers/adjective";
import { scrapeAdverb } from "./scrapers/adverb";

type Env = { serverUrl: string };
type Scrapers = {
  verb: typeof scrapeVerb;
  adjective: typeof scrapeAdjective;
  adverb: typeof scrapeAdverb;
};

const QuitOption = "quit";
type QuitOption = typeof QuitOption;

type WordOption = Word["type"];

const loop = async (
  socket: WebSocket,
  scrapers: Scrapers
): Promise<boolean> => {
  const wordOption = await prompt<WordOption | QuitOption>(
    "word option",
    "required",
    ["verb", "adjective", "adverb", QuitOption]
  );

  if (!wordOption || wordOption === QuitOption) {
    return false;
  }

  const scraper = scrapers[wordOption];
  const info = await scraper.menu();
  let word: Word | undefined = undefined;

  try {
    // i really wish this worked without an assertion
    word = await scraper.retrieve(info as any);
  } catch {
    console.log("an error occurred while retrieving word data");
  }

  if (!word) {
    return true;
  }

  console.log(word);

  if ((await yesNo()) === "y") {
    console.log(`sending word ${word.english}`);

    const message: Extract<ClientMessage, { name: "createWord" }> = {
      name: "createWord",
      message: word,
    };

    await new Promise<void>((resolve) => {
      socket.send(JSON.stringify(message), (e) => {
        console.log(
          e?.message
            ? `word failed to send, ${e.message}`
            : "word sent successfully"
        );

        resolve();
      });
    });
  }

  return true;
};

const createSocket = (url: string): Promise<WebSocket> => {
  console.log(`opening socket with url: ${url}`);

  const socket = new WebSocket(`ws://${url}`);

  return new Promise((resolve) => socket.on("open", () => resolve(socket)));
};

const main = async () => {
  const { serverUrl } = process.env as Env;

  const socket = await createSocket(serverUrl);
  const scrapers: Scrapers = {
    verb: scrapeVerb,
    adjective: scrapeAdjective,
    adverb: scrapeAdverb,
  };

  let resume = true;

  while (resume) {
    try {
      resume = await loop(socket, scrapers);
    } catch {
      console.log("what did you do 😠");
    }
  }

  console.log("closing socket");
  socket.close();

  console.log("bye!");
};

main();
