import WebSocket from "ws";
import { prompt } from "./menu";
import { Word } from "@/common/entities";
import { scrapeVerb } from "./scrapers/verb";
import { ClientMessage } from "@/common/messages";

type Env = { serverUrl: string };
type Scrapers = { verb: typeof scrapeVerb };

const QuitOption = "quit";
type QuitOption = typeof QuitOption;

type WordOption = Extract<Word["type"], "verb">;

const loop = async (
  socket: WebSocket,
  scrapers: Scrapers
): Promise<boolean> => {
  const wordOption = await prompt<WordOption | QuitOption>("word option", [
    "verb",
    QuitOption,
  ]);

  if (!wordOption || wordOption === QuitOption) {
    return false;
  }

  let word: Word | undefined = undefined;

  try {
    const scraper = scrapers[wordOption];

    const info = await scraper.menu();
    word = await scraper.retrieve(info);
  } catch {
    console.log("an error occurred while retrieving word data");
  }

  if (!word) {
    return true;
  }

  console.log(word);

  if ((await prompt("okay?", ["y", "n"])) === "y") {
    console.log(`sending word ${word.infinitive}`);

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
  const scrapers: Scrapers = { verb: scrapeVerb };

  let resume = true;

  while (resume) {
    resume = await loop(socket, scrapers);
  }

  console.log("closing socket");
  socket.close();

  console.log("bye!");
};

main();
